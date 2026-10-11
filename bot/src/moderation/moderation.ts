import { ContainerBuilder, MessageFlags, TextDisplayBuilder, type Guild, type GuildMember, type User } from 'discord.js';

import type { ModerationAction } from 'generated/client';

import { prisma } from 'database/index';
import { LOG_COLORS, log, quote, when, who } from 'moderation/log';
import { escapeMarkdown } from 'utility/markdown';

/**
 * Moderations: warns, timeouts, kicks and bans, by the bot's commands or by
 * hand in Discord. Each is kept as a case in the database, so /history shows
 * everything that's happened to someone, and posted in the log. Nothing
 * happens on its own: moderators decide.
 */

export const ACTION_LABELS: Record<ModerationAction, string> = {
  WARN: 'Warn',
  TIMEOUT: 'Timeout',
  UNTIMEOUT: 'Timeout removed',
  KICK: 'Kick',
  BAN: 'Ban',
  UNBAN: 'Unban',
};

/** What a moderation was done with: one of the bot's commands, or Discord itself (found in the audit log). */
type Source = 'command' | 'discord';

/** Keeps a moderation as a case and posts it in the log. Returns the case. */
export async function recordModeration(
  guild: Guild,
  moderation: {
    user: Pick<User, 'id' | 'username'>;
    moderator: Pick<User, 'id' | 'username'>;
    action: ModerationAction;
    reason?: string | null;
    until?: Date | null;
  },
  source: Source,
) {
  const record = await prisma.moderation.create({
    data: {
      userId: moderation.user.id,
      moderatorId: moderation.moderator.id,
      action: moderation.action,
      reason: moderation.reason || null,
      until: moderation.until ?? null,
    },
  });
  await log(guild, `${ACTION_LABELS[record.action]} · case ${record.id}`, LOG_COLORS.moderation, [
    [
      `**Member:** ${who(moderation.user)}`,
      `**By:** ${who(moderation.moderator)}`,
      record.until && `**Until:** ${when(record.until, 'f')} (${when(record.until)})`,
      source === 'discord' && '-# Done in Discord, not with the bot',
    ]
      .filter(Boolean)
      .join('\n'),
    record.reason ? quote(record.reason) : '-# No reason given',
  ]);
  return record;
}

/** What someone's told in a DM about a moderation, without who did it. */
const DM_TEXT: Partial<Record<ModerationAction, (server: string, until?: Date) => string>> = {
  WARN: (server) => `You were warned on **${server}**.`,
  TIMEOUT: (server, until) => `You were timed out on **${server}** until ${until ? when(until, 'f') : 'later'}. Until then you can read, but not talk.`,
  KICK: (server) => `You were kicked from **${server}**.`,
  BAN: (server) => `You were banned from **${server}**.`,
};

/**
 * Tells someone about a moderation in a DM, before it's done (after a kick or
 * ban, the bot no longer shares a server with them and can't). Returns
 * whether it reached them: their DMs may be closed, and it goes ahead anyway.
 */
export async function tellMember(user: User, guild: Guild, action: ModerationAction, reason: string | null, until?: Date) {
  const text = DM_TEXT[action];
  if (!text) return false;
  const container = new ContainerBuilder()
    .setAccentColor(LOG_COLORS.moderation)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        [`-# ${ACTION_LABELS[action].toUpperCase()}`, text(escapeMarkdown(guild.name), until), reason ? `**Reason:** ${escapeMarkdown(reason)}` : '']
          .filter(Boolean)
          .join('\n'),
      ),
    );
  return user
    .send({ components: [container], flags: MessageFlags.IsComponentsV2, allowedMentions: { parse: [] } })
    .then(() => true)
    .catch(() => false);
}

/**
 * Why a moderator can't act on someone, or null if they can: not themselves,
 * the server's owner, or anyone whose top role is as high as theirs (unless
 * they own the server), and nobody the bot's own role isn't above.
 */
export function cannotModerate(moderator: GuildMember, target: GuildMember, { botActs = true } = {}) {
  if (target.id === moderator.id) return "You can't do that to yourself.";
  if (target.id === target.guild.ownerId) return "That's the server's owner.";
  if (target.id === target.client.user.id) return "That's me!";
  if (moderator.id !== moderator.guild.ownerId && moderator.roles.highest.comparePositionTo(target.roles.highest) <= 0)
    return `${target} has a role as high as yours or higher, so you can't do that to them.`;
  // A warn is only written down, so the bot's role doesn't matter for it.
  if (botActs && !target.manageable) return `My role isn't above ${target}'s, so I can't do that to them. Move my role higher in the server's settings.`;
  return null;
}

/** "They got a DM." or why not, for a moderator's confirmation. */
export function dmNote(told: boolean) {
  return told ? 'They got a DM about it.' : "Their DMs are closed, so they weren't told.";
}

/** A reason as written in Discord's own audit log, with who gave it, since there the bot is who did it. */
export function auditReason(moderator: User, reason: string | null) {
  return `${reason || 'No reason given'} (by ${moderator.username})`.slice(0, 512);
}

import { AuditLogEvent, Events, PermissionsBitField, type GuildAuditLogsEntry, type User } from 'discord.js';

import { Event } from 'classes/base/event';

import { LOG_COLORS, log, quote, when, who } from 'moderation/log';
import { recordModeration } from 'moderation/moderation';
import { KEYS } from 'utility/keys';
import { logger } from 'utility/logger';
import { code, escapeMarkdown, listOf } from 'utility/markdown';

/**
 * Everything the audit log says someone did to the server, in the log: bans,
 * kicks and timeouts done by hand in Discord (kept as cases too, so they're in
 * people's history), and every other change, with who made it and what
 * changed. The bot's own entries are left out: its commands log themselves
 * with the moderator who used them, and bubbles change channels constantly.
 */
export default new Event({
  name: Events.GuildAuditLogEntryCreate,
  async execute(client, entry, guild) {
    if (guild.id !== KEYS.DISCORD_GUILD_ID || !entry.executorId || entry.executorId === client.user?.id) return;

    try {
      const executor = await client.users.fetch(entry.executorId);
      const moderation = await asModeration(entry, client.users.fetch.bind(client.users));
      if (moderation) {
        await recordModeration(guild, { ...moderation, moderator: executor, reason: entry.reason }, 'discord');
        return;
      }

      const target = describeTarget(entry);
      await log(guild, actionLabel(entry.action), LOG_COLORS.server, [
        [`**By:** ${who(executor)}`, target && `**What:** ${target}`, ...describeExtra(entry.extra)].filter(Boolean).join('\n'),
        // Something deleted lists every setting it had, which says nothing: its name is in What.
        entry.actionType === 'Delete' ? '' : entry.changes.flatMap(describeChange).join('\n'),
        entry.reason ? quote(entry.reason) : '',
      ]);
    } catch (err) {
      logger.error({ err, action: entry.action }, 'Failed to log audit log entry');
    }
  },
});

/** A ban, unban, kick, or timeout given or taken away, as a moderation. */
async function asModeration(entry: GuildAuditLogsEntry, fetchUser: (id: string) => Promise<User>) {
  if (!entry.targetId) return null;
  const timeout = entry.action === AuditLogEvent.MemberUpdate ? entry.changes.find((change) => change.key === 'communication_disabled_until') : undefined;
  const action =
    entry.action === AuditLogEvent.MemberBanAdd
      ? 'BAN'
      : entry.action === AuditLogEvent.MemberBanRemove
        ? 'UNBAN'
        : entry.action === AuditLogEvent.MemberKick
          ? 'KICK'
          : timeout
            ? timeout.new
              ? 'TIMEOUT'
              : 'UNTIMEOUT'
            : null;
  if (!action) return null;
  return { action, user: await fetchUser(entry.targetId), until: typeof timeout?.new === 'string' ? new Date(timeout.new) : null } as const;
}

/** "ChannelOverwriteUpdate" as "Channel overwrite updated". */
export function actionLabel(action: AuditLogEvent) {
  const PAST: Record<string, string> = {
    Create: 'created',
    Update: 'updated',
    Delete: 'deleted',
    Add: 'added',
    Remove: 'removed',
    Move: 'moved',
    Disconnect: 'disconnected',
    Prune: 'pruned',
    Pin: 'pinned',
    Unpin: 'unpinned',
  };
  const words = (AuditLogEvent[action] ?? `Action ${action}`).split(/(?=[A-Z])/);
  const last = words.at(-1)!;
  if (PAST[last]) words[words.length - 1] = PAST[last];
  const text = words.join(' ').toLowerCase();
  return text[0].toUpperCase() + text.slice(1);
}

/**
 * What an entry was done to, as a mention where there is one. Channels and
 * roles get their name and id in small print under it too, as they're called
 * now (or were, if deleted), since the mention of a deleted one says "unknown".
 */
export function describeTarget(entry: GuildAuditLogsEntry) {
  const id = entry.targetId;
  const nameChange = entry.changes.find((change) => change.key === 'name');
  const target = entry.target as { code?: string; name?: string } | null;
  const name = (nameChange?.new ?? target?.name ?? nameChange?.old) as string | undefined;
  const withDetails = (mention: string) => (name ? `${mention}\n-# ${code(name)} · ${id}` : `${mention}\n-# ${id}`);

  switch (entry.targetType) {
    case 'Guild':
      return 'the server';
    case 'Channel':
    case 'Thread':
      return id ? withDetails(`<#${id}>`) : null;
    case 'Role':
      return id ? withDetails(`<@&${id}>`) : null;
    case 'User':
      return id ? who({ id }) : null;
    case 'Message':
      // For a deleted message, the target is whoever sent it.
      return id ? `a message from ${who({ id })}` : null;
    case 'Invite':
      return target?.code ? `discord.gg/${target.code}` : null;
    default:
      return target?.name ? code(target.name) : name ? code(name) : id;
  }
}

/** What else an entry says, e.g. which channel a message was deleted in, or which AutoMod rule acted. */
function describeExtra(extra: unknown) {
  if (!extra || typeof extra !== 'object') return [];
  const fields = extra as { channel?: { id: string }; count?: number; removed?: number; days?: number; autoModerationRuleName?: string };
  return [
    fields.channel?.id && `**Channel:** <#${fields.channel.id}>`,
    fields.count != null && `**How many:** ${fields.count}`,
    fields.removed != null && `**Removed:** ${fields.removed}`,
    fields.days != null && `**Inactive for:** ${fields.days} days`,
    fields.autoModerationRuleName && `**Rule:** ${escapeMarkdown(fields.autoModerationRuleName)}`,
  ];
}

/** "rate_limit_per_user" as "Rate limit per user". */
function keyLabel(key: string) {
  const KNOWN: Record<string, string> = {
    nick: 'Nickname',
    nsfw: 'Age-restricted',
    rate_limit_per_user: 'Slowmode (seconds)',
    user_limit: 'User limit',
    hoist: 'Shown separately',
    mentionable: 'Anyone can mention it',
    mute: 'Server muted',
    deaf: 'Server deafened',
    communication_disabled_until: 'Timed out until',
    color: 'Colour',
    max_uses: 'Max uses',
    max_age: 'Expires after (seconds)',
  };
  if (KNOWN[key]) return KNOWN[key];
  const text = key.replace(/^\$/, '').replaceAll('_', ' ');
  return text[0].toUpperCase() + text.slice(1);
}

/** Permission names, "BanMembers" as "Ban Members". */
function permissionNames(bits: bigint) {
  // As Discord's settings call them, where that differs from the API's name.
  const SHOWN_AS: Record<string, string> = { ModerateMembers: 'Timeout Members', ManageGuild: 'Manage Server' };
  return new PermissionsBitField(bits).toArray().map((name) => SHOWN_AS[name] ?? name.split(/(?=[A-Z])/).join(' '));
}

/** A value from a change, as it reads best. */
function describeValue(key: string, value: unknown): string {
  if (value === undefined || value === null || value === '') return '*none*';
  if (typeof value === 'boolean') return value ? 'yes' : 'no';
  if (key === 'communication_disabled_until' && typeof value === 'string') return when(new Date(value), 'f');
  if (key === 'color' && typeof value === 'number') return `#${value.toString(16).padStart(6, '0')}`;
  if (key.endsWith('channel_id') && typeof value === 'string') return `<#${value}>`;
  // Names in inline code; other text, like a topic, as plain text, which reads better when it's long.
  if (typeof value === 'string' && (key === 'name' || key === 'nick')) return code(value);
  if (typeof value === 'string') return escapeMarkdown(value.length > 200 ? `${value.slice(0, 199)}…` : value);
  if (typeof value === 'number' || typeof value === 'bigint') return String(value);
  const json = JSON.stringify(value);
  return `\`${json.length > 150 ? `${json.slice(0, 149)}…` : json}\``;
}

/** One change from an entry, as lines like "**Name:** old → new". */
export function describeChange(change: { key: string; old?: unknown; new?: unknown }): string[] {
  const { key } = change;
  // Roles given or taken, as lists of roles.
  if (key === '$add' || key === '$remove') {
    const roles = ((change.new ?? []) as { id: string }[]).map((role) => `<@&${role.id}>`);
    return roles.length ? [`**${key === '$add' ? 'Roles given' : 'Roles taken'}:** ${listOf(roles)}`] : [];
  }
  // Permissions, as which were allowed or taken away.
  if (key === 'permissions' || key === 'allow' || key === 'deny') {
    const before = BigInt((change.old as string | undefined) ?? 0);
    const after = BigInt((change.new as string | undefined) ?? 0);
    const added = permissionNames(after & ~before);
    const removed = permissionNames(before & ~after);
    const label = key === 'deny' ? 'Denied' : 'Allowed';
    return [added.length && `**${label}:** ${added.join(', ')}`, removed.length && `**No longer ${label.toLowerCase()}:** ${removed.join(', ')}`].filter(
      (line): line is string => !!line,
    );
  }
  if (key === 'id' || key === 'type' || key.endsWith('_hash') || key === 'avatar' || key === 'icon') return [];
  if (!('old' in change)) return [`**${keyLabel(key)}:** ${describeValue(key, change.new)}`];
  if (!('new' in change)) return [`**${keyLabel(key)}:** ~~${describeValue(key, change.old)}~~`];
  // Each on a line of its own, which reads more easily than both on one.
  return [`**Old ${keyLabel(key)}:** ${describeValue(key, change.old)}\n**New ${keyLabel(key)}:** ${describeValue(key, change.new)}`];
}

import { AuditLogEvent, Events, PermissionsBitField, type GuildAuditLogsEntry, type User } from 'discord.js';

import { Event } from 'classes/base/event';

import { LOG_COLORS, log, quote, when, who } from 'moderation/log';
import { CHANNELS_MOVED, rememberAuditEntry } from 'moderation/audit';
import { recordModeration } from 'moderation/moderation';
import { KEYS } from 'utility/keys';
import { logger } from 'utility/logger';
import { code, escapeMarkdown, listOf } from 'utility/markdown';

/**
 * Discord's audit log, which says who did what. Every entry is kept for a
 * moment, so the events that log changes (channels, roles, members and so on,
 * in events/logs) can say who made them. Bans, kicks and timeouts done by hand
 * in Discord are kept as cases, so they're in people's history. Anything no
 * event covers, like a message deleted by someone else or a webhook, is logged
 * from here. The bot's own entries are left out: its commands log themselves
 * with the moderator who used them, and bubbles change channels constantly.
 */
export default new Event({
  name: Events.GuildAuditLogEntryCreate,
  async execute(client, entry, guild) {
    if (guild.id !== KEYS.DISCORD_GUILD_ID) return;
    rememberAuditEntry(entry);
    if (!entry.executorId || entry.executorId === client.user?.id) return;

    try {
      const executor = await client.users.fetch(entry.executorId);
      const moderation = await asModeration(entry, client.users.fetch.bind(client.users));
      if (moderation) {
        await recordModeration(guild, { ...moderation, moderator: executor, reason: entry.reason }, 'discord');
        return;
      }
      const handled = FROM_EVENTS.get(entry.action);
      if (handled === 'all') return;
      // Something deleted lists every setting it had, which says nothing: its name is in What.
      const changes = entry.actionType === 'Delete' ? [] : entry.changes.filter((change) => !handled?.has(change.key)).flatMap(describeChange);
      // Everything in it was logged by an event already.
      if (handled && !changes.length) return;

      const target = describeTarget(entry);
      await log(guild, actionLabel(entry.action), LOG_COLORS.server, [
        [`**By:** ${who(executor)}`, target && `**What:** ${target}`, ...describeExtra(entry.extra)].filter(Boolean).join('\n'),
        changes.join('\n'),
        entry.reason ? quote(entry.reason) : '',
      ]);
    } catch (err) {
      logger.error({ err, action: entry.action }, 'Failed to log audit log entry');
    }
  },
});

/**
 * What the events in events/logs log themselves, with who did it from here:
 * all of it, or the changes with these keys. Any other change in an entry,
 * like a server mute or a forum's tags, is logged from here, so nothing goes
 * unlogged that an event doesn't cover.
 */
const FROM_EVENTS = new Map<AuditLogEvent, 'all' | Set<string>>([
  [
    AuditLogEvent.GuildUpdate,
    new Set([
      'name',
      'description',
      'icon_hash',
      'banner_hash',
      'splash_hash',
      'vanity_url_code',
      'verification_level',
      'explicit_content_filter',
      'afk_channel_id',
      'afk_timeout',
      'system_channel_id',
      'rules_channel_id',
      'public_updates_channel_id',
      'owner_id',
    ]),
  ],
  [AuditLogEvent.ChannelCreate, 'all'],
  [
    AuditLogEvent.ChannelUpdate,
    new Set([
      'name',
      'parent_id',
      'position',
      'topic',
      'nsfw',
      'rate_limit_per_user',
      'bitrate',
      'user_limit',
      'rtc_region',
      'default_auto_archive_duration',
      'permission_overwrites',
    ]),
  ],
  [AuditLogEvent.ChannelDelete, 'all'],
  [AuditLogEvent.ChannelOverwriteCreate, 'all'],
  [AuditLogEvent.ChannelOverwriteUpdate, 'all'],
  [AuditLogEvent.ChannelOverwriteDelete, 'all'],
  [CHANNELS_MOVED, 'all'],
  // Timeouts are kept as cases above; mutes and deafens aren't in member-update.ts, so they're logged from here.
  [AuditLogEvent.MemberUpdate, new Set(['nick', 'communication_disabled_until'])],
  [AuditLogEvent.MemberRoleUpdate, 'all'],
  [AuditLogEvent.RoleCreate, 'all'],
  [AuditLogEvent.RoleUpdate, new Set(['name', 'color', 'colors', 'hoist', 'mentionable', 'icon_hash', 'unicode_emoji', 'permissions'])],
  [AuditLogEvent.RoleDelete, 'all'],
  [AuditLogEvent.InviteCreate, 'all'],
  [AuditLogEvent.InviteUpdate, 'all'],
  [AuditLogEvent.InviteDelete, 'all'],
  [AuditLogEvent.EmojiCreate, 'all'],
  [AuditLogEvent.EmojiUpdate, new Set(['name'])],
  [AuditLogEvent.EmojiDelete, 'all'],
  [AuditLogEvent.StickerCreate, 'all'],
  [AuditLogEvent.StickerUpdate, new Set(['name', 'description', 'tags'])],
  [AuditLogEvent.StickerDelete, 'all'],
  [AuditLogEvent.ThreadCreate, 'all'],
  [AuditLogEvent.ThreadUpdate, new Set(['name', 'archived', 'locked', 'rate_limit_per_user', 'applied_tags'])],
  [AuditLogEvent.ThreadDelete, 'all'],
  [AuditLogEvent.GuildScheduledEventCreate, 'all'],
  [AuditLogEvent.GuildScheduledEventUpdate, new Set(['name', 'description', 'scheduled_start_time', 'channel_id', 'status'])],
  [AuditLogEvent.GuildScheduledEventDelete, 'all'],
]);

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
  // Anything else Discord adds before discord.js knows it: at least say it's a change to the server.
  if (!AuditLogEvent[action]) return `Server changed (type ${action})`;
  const words = AuditLogEvent[action].split(/(?=[A-Z])/);
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

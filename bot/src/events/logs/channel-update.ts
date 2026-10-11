import { AuditLogEvent, ChannelType, Events, OverwriteType, type NonThreadGuildBasedChannel } from 'discord.js';

import { Event } from 'classes/base/event';

import { noteChannelMove } from 'moderation/channel-moves';
import { logChange, mentionWithDetails, oldNew, permissionChanges, type Change } from 'moderation/changes';
import { KEYS } from 'utility/keys';

/**
 * A channel's settings or permissions changed, with each change as it was and
 * is. Being dragged to another place in the list is worked out and logged by
 * moderation/channel-moves.ts, since Discord renumbers the channels around it too.
 */
export default new Event({
  name: Events.ChannelUpdate,
  async execute(_client, oldChannel, newChannel) {
    if (newChannel.isDMBased() || newChannel.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    const before = oldChannel as NonThreadGuildBasedChannel;
    const after = newChannel;
    const guild = after.guild;

    const newCategory = before.parentId !== after.parentId;
    if (before.rawPosition !== after.rawPosition || newCategory) noteChannelMove(guild, after.id, before.rawPosition, newCategory);

    const field = <T>(channel: NonThreadGuildBasedChannel, key: string) =>
      key in channel ? ((channel as unknown as Record<string, T>)[key] ?? null) : undefined;
    const seconds = (value: unknown) => (value ? `${value} seconds` : 'off');
    const changes: Change[] = [
      oldNew('Name', before.name, after.name, { asName: true }),
      oldNew('Category', guild.channels.cache.get(before.parentId ?? '')?.name ?? null, after.parent?.name ?? null, { asName: true }),
      oldNew('Topic', field(before, 'topic'), field(after, 'topic')),
      oldNew('Age-restricted', field(before, 'nsfw'), field(after, 'nsfw')),
      oldNew('Slowmode', field(before, 'rateLimitPerUser'), field(after, 'rateLimitPerUser'), { format: seconds }),
      oldNew('Bitrate', field(before, 'bitrate'), field(after, 'bitrate'), { format: (value) => (value ? `${Number(value) / 1000} kbps` : '*none*') }),
      oldNew('User limit', field(before, 'userLimit'), field(after, 'userLimit'), { format: (value) => (value ? String(value) : 'none') }),
      oldNew('Region', field(before, 'rtcRegion'), field(after, 'rtcRegion'), { format: (value) => (value ? String(value) : 'automatic') }),
      oldNew('Hide after inactivity', field(before, 'defaultAutoArchiveDuration'), field(after, 'defaultAutoArchiveDuration'), {
        format: (value) => (value ? `${value} minutes` : '*default*'),
      }),
      ...permissionOverwriteChanges(before, after),
    ];
    if (!changes.some(Boolean)) return;

    await logChange(guild, after.type === ChannelType.GuildCategory ? 'Category updated' : 'Channel updated', {
      actions: [AuditLogEvent.ChannelUpdate, AuditLogEvent.ChannelOverwriteCreate, AuditLogEvent.ChannelOverwriteUpdate, AuditLogEvent.ChannelOverwriteDelete],
      targetId: after.id,
      what: mentionWithDetails(`${after}`, after.name, after.id),
      changes,
    });
  },
});

/** Permissions given, changed or taken away for a role or member in a channel. */
function permissionOverwriteChanges(before: NonThreadGuildBasedChannel, after: NonThreadGuildBasedChannel): Change[] {
  const ids = new Set([...before.permissionOverwrites.cache.keys(), ...after.permissionOverwrites.cache.keys()]);
  return [...ids].map((id) => {
    const old = before.permissionOverwrites.cache.get(id);
    const now = after.permissionOverwrites.cache.get(id);
    const overwrite = now ?? old!;
    const holder = overwrite.type === OverwriteType.Member ? `<@${id}>` : id === after.guild.id ? '@everyone' : `<@&${id}>`;

    if (!now) return `**Permissions for ${holder} removed**`;
    const lines = [
      ...permissionChanges(old?.allow.bitfield ?? 0n, now.allow.bitfield),
      ...permissionChanges(old?.deny.bitfield ?? 0n, now.deny.bitfield, { added: 'Denied', removed: 'No longer denied' }),
    ].filter(Boolean);
    if (!lines.length) return old ? null : `**Permissions for ${holder} added**, all as the server has them`;
    return [`**Permissions for ${holder}${old ? '' : ' added'}**`, ...lines].join('\n');
  });
}

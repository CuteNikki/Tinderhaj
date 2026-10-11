import { AuditLogEvent, Events, GuildScheduledEventStatus } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange, oldNew } from 'moderation/changes';
import { when } from 'moderation/log';
import { KEYS } from 'utility/keys';
import { code } from 'utility/markdown';

export default new Event({
  name: Events.GuildScheduledEventUpdate,
  async execute(_client, before, after) {
    if (!after.guild || after.guild.id !== KEYS.DISCORD_GUILD_ID || !before) return;
    const changes = [
      oldNew('Name', before.name, after.name, { asName: true }),
      oldNew('Description', before.description, after.description),
      oldNew('Starts', before.scheduledStartTimestamp, after.scheduledStartTimestamp, { format: (value) => (value ? when(Number(value), 'f') : '*none*') }),
      oldNew('Where', before.channelId, after.channelId, { format: (value) => (value ? `<#${value}>` : '*none*') }),
      oldNew('Status', before.status, after.status, { format: (value) => GuildScheduledEventStatus[value as number] ?? String(value) }),
    ];
    if (!changes.some(Boolean)) return;
    await logChange(after.guild, 'Event updated', {
      actions: AuditLogEvent.GuildScheduledEventUpdate,
      targetId: after.id,
      what: `${code(after.name)}\n-# ${after.id}`,
      changes,
    });
  },
});

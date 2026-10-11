import { AuditLogEvent, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange } from 'moderation/changes';
import { when } from 'moderation/log';
import { KEYS } from 'utility/keys';
import { code } from 'utility/markdown';

export default new Event({
  name: Events.GuildScheduledEventCreate,
  async execute(_client, event) {
    if (!event.guild || event.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    await logChange(event.guild, 'Event created', {
      actions: AuditLogEvent.GuildScheduledEventCreate,
      targetId: event.id,
      what: `${code(event.name)}\n-# ${event.id}`,
      changes: [event.scheduledStartAt && `**Starts:** ${when(event.scheduledStartAt, 'f')}`, event.channelId && `**Where:** <#${event.channelId}>`],
    });
  },
});

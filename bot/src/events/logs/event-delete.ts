import { AuditLogEvent, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange } from 'moderation/changes';
import { KEYS } from 'utility/keys';
import { code } from 'utility/markdown';

export default new Event({
  name: Events.GuildScheduledEventDelete,
  async execute(_client, event) {
    if (!event.guild || event.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    await logChange(event.guild, 'Event deleted', {
      actions: AuditLogEvent.GuildScheduledEventDelete,
      targetId: event.id,
      what: `${code(event.name ?? 'an event')}\n-# ${event.id}`,
      changes: [],
    });
  },
});

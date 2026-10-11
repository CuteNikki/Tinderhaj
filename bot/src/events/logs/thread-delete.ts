import { AuditLogEvent, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange, mentionWithDetails } from 'moderation/changes';
import { KEYS } from 'utility/keys';

export default new Event({
  name: Events.ThreadDelete,
  async execute(_client, thread) {
    if (thread.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    await logChange(thread.guild, 'Thread deleted', {
      actions: AuditLogEvent.ThreadDelete,
      targetId: thread.id,
      what: mentionWithDetails(`${thread}`, thread.name, thread.id),
      changes: [thread.parentId && `**In:** <#${thread.parentId}>`],
    });
  },
});

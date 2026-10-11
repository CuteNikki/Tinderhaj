import { AuditLogEvent, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange, mentionWithDetails } from 'moderation/changes';
import { KEYS } from 'utility/keys';

export default new Event({
  name: Events.GuildRoleDelete,
  async execute(_client, role) {
    if (role.guild.id !== KEYS.DISCORD_GUILD_ID || role.managed) return;
    await logChange(role.guild, 'Role deleted', {
      actions: AuditLogEvent.RoleDelete,
      targetId: role.id,
      what: mentionWithDetails(`${role}`, role.name, role.id),
      changes: [],
    });
  },
});

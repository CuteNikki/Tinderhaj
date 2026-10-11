import { AuditLogEvent, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange, mentionWithDetails, permissionNames } from 'moderation/changes';
import { KEYS } from 'utility/keys';

export default new Event({
  name: Events.GuildRoleCreate,
  async execute(_client, role) {
    if (role.guild.id !== KEYS.DISCORD_GUILD_ID || role.managed) return;
    const permissions = permissionNames(role.permissions.bitfield);
    await logChange(role.guild, 'Role created', {
      actions: AuditLogEvent.RoleCreate,
      targetId: role.id,
      what: mentionWithDetails(`${role}`, role.name, role.id),
      changes: [permissions.length > 0 && `**Allowed:** ${permissions.join(', ')}`],
    });
  },
});

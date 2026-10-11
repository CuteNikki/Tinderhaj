import { AuditLogEvent, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange, mentionWithDetails, oldNew, permissionChanges } from 'moderation/changes';
import { KEYS } from 'utility/keys';

/**
 * A role's settings changed. Its place in the list is left out: moving one
 * role renumbers the others, which would be a flood of entries saying nothing.
 */
export default new Event({
  name: Events.GuildRoleUpdate,
  async execute(_client, before, after) {
    if (after.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    const colour = (value: unknown) => (value ? `#${Number(value).toString(16).padStart(6, '0')}` : '*none*');
    const changes = [
      oldNew('Name', before.name, after.name, { asName: true }),
      oldNew('Colour', before.color, after.color, { format: colour }),
      oldNew('Shown separately', before.hoist, after.hoist),
      oldNew('Anyone can mention it', before.mentionable, after.mentionable),
      oldNew('Icon', before.icon ?? before.unicodeEmoji, after.icon ?? after.unicodeEmoji, { format: (value) => (value ? 'set' : '*none*') }),
      ...permissionChanges(before.permissions.bitfield, after.permissions.bitfield),
    ];
    if (!changes.some(Boolean)) return;

    await logChange(after.guild, 'Role updated', {
      actions: AuditLogEvent.RoleUpdate,
      targetId: after.id,
      what: mentionWithDetails(`${after}`, after.name, after.id),
      changes,
    });
  },
});

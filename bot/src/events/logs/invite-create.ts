import { AuditLogEvent, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange } from 'moderation/changes';
import { when } from 'moderation/log';
import { KEYS } from 'utility/keys';
import { code } from 'utility/markdown';

export default new Event({
  name: Events.InviteCreate,
  async execute(_client, invite) {
    if (!invite.guild || invite.guild.id !== KEYS.DISCORD_GUILD_ID || !('members' in invite.guild)) return;
    await logChange(invite.guild, 'Invite created', {
      actions: AuditLogEvent.InviteCreate,
      targetId: null,
      what: code(`discord.gg/${invite.code}`),
      changes: [
        invite.channelId && `**Into:** <#${invite.channelId}>`,
        `**Uses:** ${invite.maxUses ? `up to ${invite.maxUses}` : 'any number'}`,
        `**Expires:** ${invite.expiresAt ? when(invite.expiresAt) : 'never'}`,
        invite.temporary && '**Temporary:** members leave again when they go offline, unless given a role',
      ],
    });
  },
});

import { AuditLogEvent, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange } from 'moderation/changes';
import { KEYS } from 'utility/keys';
import { code } from 'utility/markdown';

/** An invite deleted, or run out: one that expired or was used up has no one who deleted it. */
export default new Event({
  name: Events.InviteDelete,
  async execute(_client, invite) {
    if (!invite.guild || invite.guild.id !== KEYS.DISCORD_GUILD_ID || !('members' in invite.guild)) return;
    await logChange(invite.guild, 'Invite deleted', {
      actions: AuditLogEvent.InviteDelete,
      targetId: null,
      what: code(`discord.gg/${invite.code}`),
      changes: [invite.channelId && `**Into:** <#${invite.channelId}>`],
    });
  },
});

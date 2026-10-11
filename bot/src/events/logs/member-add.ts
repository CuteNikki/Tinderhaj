import { Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { LOG_COLORS, log, when, who } from 'moderation/log';
import { KEYS } from 'utility/keys';

/** An account this new is worth a second look. */
const NEW_ACCOUNT = 7 * 24 * 60 * 60 * 1000;

export default new Event({
  name: Events.GuildMemberAdd,
  async execute(_client, member) {
    if (member.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    const isNew = Date.now() - member.user.createdTimestamp < NEW_ACCOUNT;
    await log(member.guild, member.user.bot ? 'Bot added' : 'Joined', LOG_COLORS.join, [
      [
        who(member.user),
        `**Account made:** ${when(member.user.createdAt)}${isNew ? ' · ⚠️ new account' : ''}`,
        `-# Member ${member.guild.memberCount} on the server`,
      ].join('\n'),
    ]);
  },
});

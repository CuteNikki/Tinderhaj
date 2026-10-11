import { Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { LOG_COLORS, log, when, who } from 'moderation/log';
import { KEYS } from 'utility/keys';
import { listOf } from 'utility/markdown';

/** Someone leaving, for whatever reason: a kick or ban has its own entry too, with who did it. */
export default new Event({
  name: Events.GuildMemberRemove,
  async execute(_client, member) {
    if (member.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    // Known only if the bot saw them while they were here.
    const roles = member.partial ? [] : member.roles.cache.filter((role) => role.id !== member.guild.roles.everyone.id).map((role) => `<@&${role.id}>`);
    await log(member.guild, member.user.bot ? 'Bot removed' : 'Left', LOG_COLORS.leave, [
      [
        who(member.user),
        member.joinedAt && `**Joined:** ${when(member.joinedAt)}`,
        roles.length && `**Roles:** ${listOf(roles)}`,
        `-# ${member.guild.memberCount} on the server now`,
      ]
        .filter(Boolean)
        .join('\n'),
    ]);
  },
});

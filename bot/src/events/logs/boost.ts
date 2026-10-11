import { Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { LOG_COLORS, log, when, who } from 'moderation/log';
import { KEYS } from 'utility/keys';

/** Someone starting or stopping boosting the server, which the audit log doesn't record. */
export default new Event({
  name: Events.GuildMemberUpdate,
  async execute(_client, before, after) {
    if (after.guild.id !== KEYS.DISCORD_GUILD_ID || before.partial || before.premiumSinceTimestamp === after.premiumSinceTimestamp) return;
    const boosting = !!after.premiumSince;
    await log(after.guild, boosting ? 'Boosted' : 'Stopped boosting', LOG_COLORS.voice, [
      [
        `${who(after)} ${boosting ? 'boosted the server 💎' : 'stopped boosting the server'}`,
        before.premiumSince && !boosting && `**Boosted since:** ${when(before.premiumSince)}`,
        `-# ${after.guild.premiumSubscriptionCount ?? 0} boosts now`,
      ]
        .filter(Boolean)
        .join('\n'),
    ]);
  },
});

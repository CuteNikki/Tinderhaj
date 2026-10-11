import { Events, type VoiceBasedChannel } from 'discord.js';

import { Event } from 'classes/base/event';

import { hubChannel } from 'bubbles/bubble';
import { LOG_COLORS, log, who } from 'moderation/log';
import { KEYS } from 'utility/keys';
import { code } from 'utility/markdown';

/**
 * A channel's name and id in small print, under its mention: bubbles are gone
 * by the time anyone reads the log, and then the mention only says "unknown".
 */
function details(label: string, channel: VoiceBasedChannel) {
  return `-# ${label}${code(channel.name)} · ${channel.id}`;
}

/**
 * Someone joining, leaving or moving between voice channels. Muting and the
 * like are left out, and so is the join-to-create channel itself: it only
 * passes people on to their bubble, so that's logged as joining the bubble.
 */
export default new Event({
  name: Events.VoiceStateUpdate,
  async execute(_client, before, after) {
    if (after.guild.id !== KEYS.DISCORD_GUILD_ID || before.channelId === after.channelId) return;
    const member = after.member ?? before.member;
    if (!member || member.user.bot) return;

    const hubId = hubChannel(after.guild)?.id;
    const from = before.channelId === hubId ? null : before.channel;
    const to = after.channelId === hubId ? null : after.channel;
    if (!from && !to) return;

    const [label, lines] = !from
      ? ['Joined voice', [`${who(member)} joined ${to}`, details('', to!)]]
      : !to
        ? ['Left voice', [`${who(member)} left ${from}`, details('', from)]]
        : ['Moved in voice', [`${who(member)} went from ${from} to ${to}`, details('From: ', from), details('To: ', to)]];
    await log(after.guild, label, LOG_COLORS.voice, [lines.join('\n')]);
  },
});

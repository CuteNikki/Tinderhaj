import { ChannelType, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { blowBubble, hubChannel, settleBubble } from 'bubbles/bubble';
import { prisma } from 'database/index';
import { logger } from 'utility/logger';

/** Someone joining, leaving or moving between voice channels: blows, settles or updates bubbles. */
export default new Event({
  name: Events.VoiceStateUpdate,
  async execute(_client, oldState, newState) {
    if (oldState.channelId === newState.channelId) return;
    const ids = [oldState.channelId, newState.channelId].filter((id): id is string => !!id);
    const bubbles = new Set((await prisma.bubble.findMany({ where: { channelId: { in: ids } }, select: { channelId: true } })).map((b) => b.channelId));

    // Left (or moved out of) a bubble: it may be empty now, or its owner gone.
    const left = oldState.channel;
    if (left?.type === ChannelType.GuildVoice && bubbles.has(left.id))
      await settleBubble(left).catch((err) => logger.error({ err }, 'Failed to settle bubble'));

    const joined = newState.channel;
    if (!joined || !newState.member || newState.member.user.bot) return;
    if (joined.id === hubChannel(newState.guild)?.id) await blowBubble(newState.member).catch((err) => logger.error({ err }, 'Failed to blow bubble'));
    // Joined a bubble: its owner may be back, and the panel shows who's here.
    else if (joined.type === ChannelType.GuildVoice && bubbles.has(joined.id))
      await settleBubble(joined).catch((err) => logger.error({ err }, 'Failed to settle bubble'));
  },
});

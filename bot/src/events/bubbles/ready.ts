import { ChannelType, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { blowBubble, forgetBubble, hubChannel, settleBubble } from 'bubbles/bubble';
import { ensureControlsMessage } from 'bubbles/panel';
import { prisma } from 'database/index';
import { KEYS } from 'utility/keys';
import { logger } from 'utility/logger';

/** On start: catches up on whatever happened to bubbles while the bot was away. */
export default new Event({
  name: Events.ClientReady,
  once: true,
  async execute(_client, readyClient) {
    const guild = readyClient.guilds.cache.get(KEYS.DISCORD_GUILD_ID);
    if (!guild || !KEYS.DISCORD_CHANNEL_JOIN_TO_CREATE) return;
    const hub = hubChannel(guild);
    if (!hub) {
      logger.warn('DISCORD_CHANNEL_JOIN_TO_CREATE is not a voice channel on the server');
      return;
    }

    for (const { channelId } of await prisma.bubble.findMany({ select: { channelId: true } })) {
      const channel = guild.channels.cache.get(channelId);
      // Deleted by hand while the bot was away.
      if (channel?.type !== ChannelType.GuildVoice) await forgetBubble(channelId);
      // Pops it if it emptied, starts the clock if its owner left, and brings its panel up to date.
      else await settleBubble(channel).catch((err) => logger.error({ err }, 'Failed to settle bubble'));
    }

    // Anyone already waiting in join-to-create gets their bubble.
    for (const member of hub.members.filter((member) => !member.user.bot).values())
      await blowBubble(member).catch((err) => logger.error({ err }, 'Failed to blow bubble'));
    await ensureControlsMessage(guild, hub.id).catch((err) => logger.error({ err }, 'Failed to post the bubble controls message'));
  },
});

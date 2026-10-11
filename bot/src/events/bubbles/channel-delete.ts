import { Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { forgetBubble } from 'bubbles/bubble';

/** A bubble deleted by hand, or by the bot: nothing left to remember. */
export default new Event({
  name: Events.ChannelDelete,
  async execute(_client, channel) {
    if (!channel.isDMBased()) await forgetBubble(channel.id);
  },
});

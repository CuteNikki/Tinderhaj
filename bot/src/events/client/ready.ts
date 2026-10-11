import { Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logger, table } from 'utility/logger';

export default new Event({
  name: Events.ClientReady,
  once: true,
  async execute(_client, readyClient) {
    logger.info(`Logged in as:\n${table([{ username: readyClient.user.tag, id: readyClient.user.id, guilds: readyClient.guilds.cache.size }])}`);
  },
});

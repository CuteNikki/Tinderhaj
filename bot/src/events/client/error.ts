import { Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logger } from 'utility/logger';

/** Errors from the connection to Discord. Without a listener for them, the first one would end the process. */
export default new Event({
  name: Events.Error,
  execute(_client, err) {
    logger.error({ err }, 'Client error');
  },
});

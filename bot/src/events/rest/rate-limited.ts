import { RESTEvents } from 'discord.js';

import { Event } from 'classes/base/event';

import { logger } from 'utility/logger';

export default new Event({
  name: RESTEvents.RateLimited,
  rest: true,
  execute(_client, info) {
    logger.debug({ route: info.route, method: info.method, retryAfter: info.retryAfter }, 'Rate limited');
  },
});

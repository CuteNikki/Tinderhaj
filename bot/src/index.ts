import { ExtendedClient } from 'classes/base/client';
import { logger } from 'utility/logger';

// Anything that fails with nobody waiting on it (a timer, say) is logged, rather than ending the process as Bun otherwise would.
process.on('unhandledRejection', (err) => logger.error({ err }, 'Unhandled rejection'));

// One server, so one process: no sharding.
new ExtendedClient();

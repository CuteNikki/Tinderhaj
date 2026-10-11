import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from 'generated/client';

import { KEYS } from 'utility/keys';

/**
 * The site's database, with the client generated from its schema
 * (prisma/schema.prisma), set up like the site's. The bot reads whatever it
 * needs, but only changes its own tables (bubbles): the site's data is changed
 * by the site's code, which also keeps its cache, Discord roles and posts in
 * step.
 */
export const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: KEYS.DATABASE_URL,
    connectionTimeoutMillis: 5_000,
    query_timeout: 10_000,
    statement_timeout: 10_000,
  }),
});

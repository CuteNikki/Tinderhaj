import { PrismaPg } from '@prisma/adapter-pg';
import { attachDatabasePool } from '@vercel/functions';
import { Pool } from 'pg';

import { PrismaClient } from '@/generated/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// The database server is shared with other sites and services, so each pool stays small. A build prerenders pages in
// one worker per CPU, each with its own pool, so there each gets even fewer.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: process.env.NEXT_PHASE === 'phase-production-build' ? 2 : 5,
  connectionTimeoutMillis: 5_000,
  query_timeout: 10_000,
  statement_timeout: 10_000,
});
// Lets Vercel close idle connections before it suspends the function, instead of leaving them open on the server.
attachDatabasePool(pool);

const adapter = new PrismaPg(pool);

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

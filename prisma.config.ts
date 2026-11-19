import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// The same files Next.js reads, so the CLI and the app use one database
config({ path: ['.env.local', '.env'], quiet: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations', seed: 'bun prisma/seed.ts' },
  datasource: { url: process.env.DATABASE_URL },
});

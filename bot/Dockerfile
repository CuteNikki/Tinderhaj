# Built from the repo root (see docker-compose.yml), since the bot uses the site's Prisma schema.
FROM oven/bun:1-alpine

WORKDIR /app/bot

COPY bot/package.json bot/bun.lock ./
# Prisma's migrations engine isn't needed to generate its client, nor by the
# bot. Saying it's there keeps Prisma from downloading it as it installs and
# generates, which from Docker's network, with no IPv6, can time out. Only for
# the build, so a migration run by hand in the container gets the real engine
ARG PRISMA_SCHEMA_ENGINE_BINARY=/bin/true
RUN bun install --frozen-lockfile
# The site's client, generated to /app/generated as the schema says. It finds its packages through /app/node_modules.
COPY prisma/schema.prisma /app/prisma/schema.prisma
RUN ln -s /app/bot/node_modules /app/node_modules && bun run db:generate

COPY bot/tsconfig.json ./
COPY bot/src ./src

# The site applies migrations, bubbles' included, so the bot only starts.
CMD ["bun", "run", "start"]

# Built with Bun, run on Node: Next's own standalone server, with just what it needs.
FROM oven/bun:1.4.0-alpine AS build
WORKDIR /app
# Dependencies first, so a change to the code alone reuses them. Installing
# generates the Prisma client, which needs the schema and, for its config,
# DATABASE_URL from the site's .env
COPY package.json bun.lock prisma.config.ts ./
COPY prisma ./prisma
# The .env comes in as a build secret, there only for the steps that need it
RUN --mount=type=secret,id=env,target=/app/.env bun install --frozen-lockfile
COPY . .
# The build needs it too: the pages it prerenders read the database. The copy
# Next makes of it into the standalone server is deleted in the same step, so
# the image doesn't keep it: the server gets its settings at runtime
RUN --mount=type=secret,id=env,target=/app/.env bun run build && rm -f .next/standalone/.env

FROM node:24-alpine
WORKDIR /app
# Next listens on HOSTNAME, which Docker sets to the container's id; every address instead
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
# Owned by node, as the server writes its cache into .next/cache
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]

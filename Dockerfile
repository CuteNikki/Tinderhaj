# Built with Bun, run on Node: Next's own standalone server, with just what it needs.
FROM oven/bun:1.4.4-alpine AS build
WORKDIR /app
# Dependencies first, so a change to the code alone reuses them. Installing
# generates the Prisma client, which needs the schema
COPY package.json bun.lock prisma.config.ts ./
COPY prisma ./prisma
RUN bun install --frozen-lockfile
COPY . .
# The site's .env comes in as a build secret: the pages it prerenders read the
# database. It's there for this step only, and the copy Next makes of it into
# the standalone server is deleted in the same step, so the image doesn't keep
# it: the server gets its settings at runtime
RUN --mount=type=secret,id=env,target=/app/.env bun run build && rm -f .next/standalone/.env

# The database's migrations, which compose's migrate runs before the site starts:
# Prisma and the migrations alone, at the versions package.json names, with
# its engine downloaded here, as it's built. Otherwise each run downloads it
# afresh, and when Prisma's host doesn't answer, as it now and then doesn't
# from Docker's network, the migration fails and the site doesn't start;
# a build that fails leaves the one that's running. Tries, each waiting
# longer, ride out a while of it not answering, and each checks the engine
# came, as Prisma's own download fails quietly. Built again only when
# package.json changes, so most deploys download nothing
FROM oven/bun:1.4.4-alpine AS migrate
WORKDIR /app
COPY package.json ./app.json
RUN echo '{ "private": true, "trustedDependencies": ["prisma", "@prisma/engines"] }' > package.json \
  && for try in 1 2 3 4 5 6; do \
    bun add \
      prisma@$(bun -e 'console.log(require("./app.json").devDependencies.prisma)') \
      dotenv@$(bun -e 'console.log(require("./app.json").devDependencies.dotenv)') \
    && ls node_modules/@prisma/engines/schema-engine-* >/dev/null 2>&1 \
    && break; \
    [ "$try" = 6 ] && { echo "Couldn't download Prisma's engine" >&2; exit 1; }; \
    rm -rf node_modules; \
    sleep $((try * 10)); \
  done
COPY prisma.config.ts ./
COPY prisma ./prisma
CMD ["bunx", "prisma", "migrate", "deploy"]

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

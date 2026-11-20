import type { Client } from 'discord.js';

import { logger } from '@/utility/logger';

/**
 * The bot's numbers over HTTP, for a dashboard such as dash to show: GET
 * /status on STATUS_PORT (8080 by default), with its servers, members and
 * channels, its ping and how long it's been connected, from what the bot
 * already knows, so it asks Discord nothing. Only for the machine's own
 * containers: the compose file publishes no port for it.
 *
 * Run as more than one shard, every shard is asked for its servers, through
 * the shard manager.
 */

/** The most servers the answer lists, biggest first. */
const LISTED = 100;

/** What one process knows: its shards, and the servers on them. */
type Part = {
  uptime: number | null;
  shards: { id: number; ping: number }[];
  servers: { name: string; members: number; channels: number; shard: number }[];
};

// Uses nothing from outside itself: run as more than one shard, the shard manager sends its source to each
// process, where nothing else from this file exists
const partOf = (client: Client): Part => ({
  uptime: client.uptime,
  shards: client.ws.shards.map((shard) => ({ id: shard.id, ping: shard.ping })),
  servers: client.guilds.cache.map((guild) => ({
    name: guild.name,
    members: guild.memberCount,
    channels: guild.channels.cache.size,
    shard: guild.shardId,
  })),
});

/** What every process knows, from every shard when there are more than one. */
async function partsOf(client: Client): Promise<Part[]> {
  return client.shard ? client.shard.broadcastEval(partOf) : [partOf(client)];
}

async function statusOf(client: Client) {
  const parts = await partsOf(client);
  const servers = parts.flatMap((part) => part.servers);
  // A shard not yet connected has no ping (-1)
  const shards = parts
    .flatMap((part) => part.shards)
    .map((shard) => ({
      id: shard.id,
      ping: shard.ping >= 0 ? Math.round(shard.ping) : null,
      servers: servers.filter((server) => server.shard === shard.id).length,
    }));
  const pings = shards.flatMap((shard) =>
    shard.ping === null ? [] : [shard.ping]
  );
  const uptimes = parts.flatMap((part) =>
    part.uptime === null ? [] : [part.uptime]
  );
  return {
    ready: client.isReady(),
    name: client.user?.username ?? null,
    id: client.user?.id ?? null,
    // A still picture, even of an animated avatar
    avatar:
      client.user?.displayAvatarURL({
        extension: 'png',
        size: 128,
        forceStatic: true,
      }) ?? null,
    // Milliseconds connected, of the shard that's been connected longest
    uptime: uptimes.length ? Math.max(...uptimes) : null,
    // Milliseconds to Discord and back, on average over its shards
    ping: pings.length
      ? Math.round(pings.reduce((sum, ping) => sum + ping, 0) / pings.length)
      : null,
    shards,
    servers: servers.length,
    members: servers.reduce((sum, server) => sum + server.members, 0),
    channels: servers.reduce((sum, server) => sum + server.channels, 0),
    biggest: servers
      .sort((a, b) => b.members - a.members)
      .slice(0, LISTED)
      .map(({ name, members }) => ({ name, members })),
  };
}

export function serveStatus(client: Client) {
  // Run as more than one shard, the process with the first serves it for all
  if (client.shard && !client.shard.ids.includes(0)) return;
  const port = Number(process.env.STATUS_PORT ?? 8080);
  Bun.serve({
    port,
    async fetch(request) {
      const { pathname } = new URL(request.url);
      if (request.method !== 'GET' || pathname !== '/status') {
        return new Response('Not found', { status: 404 });
      }
      return Response.json(await statusOf(client), {
        headers: { 'Cache-Control': 'no-store' },
      });
    },
  });
  logger.info(`Serving the status on port ${port}`);
}

import 'server-only';

/**
 * One call to Discord's API as the site's bot (DISCORD_BOT_TOKEN), waiting out
 * a rate limit once if it hits one. `reason` shows in the server's audit log.
 */
export async function discord(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  options: { reason: string; body?: unknown },
  retried = false,
): Promise<Response> {
  const response = await fetch(`https://discord.com/api/v10${path}`, {
    method,
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'X-Audit-Log-Reason': options.reason,
      ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: AbortSignal.timeout(8000),
  });
  if (response.status === 429 && !retried) {
    const { retry_after: wait = 1 } = (await response.json().catch(() => ({}))) as { retry_after?: number };
    await new Promise((resolve) => setTimeout(resolve, Math.min(wait, 5) * 1000));
    return discord(method, path, options, true);
  }
  return response;
}

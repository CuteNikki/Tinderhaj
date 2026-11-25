import 'server-only';

import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Asking the site to refresh what's tagged, from work that runs outside a
 * request (the schedule, see lib/schedule.ts): Next only lets route handlers
 * and server functions do that, so it asks its own route (app/api/revalidate)
 * with a signature only the site can make.
 */
function signature(tag: string) {
  return createHmac('sha256', process.env.BETTER_AUTH_SECRET ?? '')
    .update(`revalidate:${tag}`)
    .digest('base64url');
}

export function isRevalidateSignature(tag: string, given: string | null) {
  if (!given) return false;
  const expected = Buffer.from(signature(tag));
  const actual = Buffer.from(given);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Refreshes what's tagged `tag`, through the site's own server. A failure is only logged: the hourly refresh catches up. */
export async function revalidateFromOutside(tag: string) {
  const url = new URL(
    '/api/revalidate',
    `http://127.0.0.1:${process.env.PORT ?? 3000}`
  );
  url.searchParams.set('tag', tag);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { authorization: `Bearer ${signature(tag)}` },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok)
      console.error(`Failed to refresh ${tag}: ${response.status}`);
  } catch (error) {
    console.error(`Failed to refresh ${tag}`, error);
  }
}

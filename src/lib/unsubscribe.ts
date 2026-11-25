import 'server-only';

import { createHmac, timingSafeEqual } from 'crypto';

import { siteURL } from '@/lib/site-url';

/**
 * Links to stop the emails about verified sharks, without signing in: each
 * holds the account and a signature only the site can make, so nobody can
 * turn off someone else's. They don't expire, as an old email's link should
 * still work.
 */
function signature(userId: string) {
  return createHmac('sha256', process.env.BETTER_AUTH_SECRET ?? '')
    .update(`unsubscribe:verified:${userId}`)
    .digest('base64url');
}

/** Where the email's links go: the page to confirm on, and the one mail apps' own button posts to. */
export function unsubscribeUrls(userId: string) {
  const query = new URLSearchParams({ u: userId, t: signature(userId) });
  return {
    page: new URL(`/unsubscribe?${query}`, siteURL).href,
    oneClick: new URL(`/api/unsubscribe?${query}`, siteURL).href,
  };
}

/** The account a link is for, or null if its signature doesn't match. */
export function readUnsubscribe(userId: unknown, given: unknown) {
  if (typeof userId !== 'string' || typeof given !== 'string') return null;
  const expected = Buffer.from(signature(userId));
  const actual = Buffer.from(given);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    return null;
  return userId;
}

import 'server-only';

import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Remembers which banned account just tried to sign in, so /banned can say
 * why without anyone else being able to look up a ban. Signed, so it can't
 * be made up, and short-lived.
 */
export const BAN_NOTICE_COOKIE = 'tinderhaj.ban_notice';

export const BAN_NOTICE_MAX_AGE = 15 * 60;

function signature(payload: string) {
  return createHmac('sha256', process.env.BETTER_AUTH_SECRET ?? '')
    .update(`${BAN_NOTICE_COOKIE}:${payload}`)
    .digest('base64url');
}

export function signBanNotice(userId: string) {
  const payload = `${userId}.${Date.now() + BAN_NOTICE_MAX_AGE * 1000}`;
  return `${payload}.${signature(payload)}`;
}

/** The account the cookie was made for, or null if it's invalid or old. */
export function readBanNotice(value: string | undefined) {
  const [userId, expires, given] = value?.split('.') ?? [];
  if (!userId || !expires || !given) return null;

  const expected = Buffer.from(signature(`${userId}.${expires}`));
  const actual = Buffer.from(given);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected) || Number(expires) < Date.now()) return null;

  return userId;
}

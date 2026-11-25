import 'server-only';

import { createHmac, timingSafeEqual } from 'crypto';

import {
  isNotificationKind,
  NOTIFICATIONS,
  type NotificationKind,
} from '@/constants/notifications';

import prisma from '@/lib/prisma';
import { siteURL } from '@/lib/site-url';

/**
 * Links to stop one kind of email, without signing in: each holds the account,
 * the kind, and a signature only the site can make, so nobody can turn off
 * someone else's. They don't expire, as an old email's link should still work.
 */
function signature(userId: string, kind: NotificationKind) {
  return createHmac('sha256', process.env.BETTER_AUTH_SECRET ?? '')
    .update(`unsubscribe:${kind}:${userId}`)
    .digest('base64url');
}

/** Where the email's links go: the page to confirm on, and the one mail apps' own button posts to. */
export function unsubscribeUrls(userId: string, kind: NotificationKind) {
  const query = new URLSearchParams({
    u: userId,
    k: kind,
    t: signature(userId, kind),
  });
  return {
    page: new URL(`/unsubscribe?${query}`, siteURL).href,
    oneClick: new URL(`/api/unsubscribe?${query}`, siteURL).href,
  };
}

/** The account and kind a link is for, or null if its signature doesn't match. */
export function readUnsubscribe(
  userId: unknown,
  kind: unknown,
  given: unknown
) {
  if (
    typeof userId !== 'string' ||
    typeof given !== 'string' ||
    !isNotificationKind(kind)
  )
    return null;
  const expected = Buffer.from(signature(userId, kind));
  const actual = Buffer.from(given);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    return null;
  return { userId, kind };
}

/** Turns one kind of email off or on for an account. */
export async function setNotification(
  userId: string,
  kind: NotificationKind,
  on: boolean
) {
  await prisma.user.updateMany({
    where: { id: userId },
    data: { [NOTIFICATIONS[kind].field]: on },
  });
}

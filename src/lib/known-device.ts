import 'server-only';

import { createHmac, timingSafeEqual } from 'crypto';
import { after } from 'next/server';

import { isBanned } from '@/lib/bans';
import { sendNewDeviceEmail } from '@/lib/email';
import prisma from '@/lib/prisma';
import { siteURL } from '@/lib/site-url';
import { describeUserAgent } from '@/lib/user-agent';

/**
 * Remembers that an account has signed in on this browser before, so signing
 * in again after signing out isn't a new device. It only fits that account,
 * signed so it can't be made up. A year, renewed at each sign-in.
 */
export const KNOWN_DEVICE_COOKIE = 'tinderhaj.known_device';
export const KNOWN_DEVICE_MAX_AGE = 365 * 24 * 60 * 60;

/** How soon after signing up a sign-in is still part of it: the account's first. */
const SIGN_UP_GRACE = 10 * 60 * 1000;

export function knownDeviceValue(userId: string) {
  return createHmac('sha256', process.env.BETTER_AUTH_SECRET ?? '')
    .update(`known-device:${userId}`)
    .digest('base64url');
}

export function isKnownDevice(userId: string, value: string | null) {
  if (!value) return false;
  const expected = Buffer.from(knownDeviceValue(userId));
  const actual = Buffer.from(value);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/**
 * Emails someone that their account was signed in to from a browser it never
 * was before, once the response has gone: how, from where, and when. Not for
 * the sign-in that comes with signing up, nor to an address that isn't
 * confirmed. Always, as it's about their account's safety.
 */
export function emailNewDeviceLater(session: {
  userId: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: Date;
}) {
  after(async () => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          username: true,
          email: true,
          emailVerified: true,
          createdAt: true,
          banned: true,
          banExpires: true,
        },
      });
      if (!user?.emailVerified || isBanned(user)) return;
      if (
        session.createdAt.getTime() - user.createdAt.getTime() <
        SIGN_UP_GRACE
      )
        return;

      await sendNewDeviceEmail({
        email: user.email,
        username: user.username,
        device: describeUserAgent(session.userAgent),
        // Left out when it's only zeros: no address came with the request
        ip:
          session.ipAddress && !/^[0:.]+$/.test(session.ipAddress)
            ? session.ipAddress
            : null,
        at: session.createdAt,
        url: new URL('/dashboard/account', siteURL).href,
      });
    } catch (error) {
      console.error('Failed to email about a new sign-in', error);
    }
  });
}

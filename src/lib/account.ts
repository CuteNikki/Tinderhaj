import 'server-only';

import { trustedDevicesWhere } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { describeUserAgent } from '@/lib/user-agent';

/** How signing in with a password asks for a second step, if at all. */
export type TwoFactorMethod = 'app' | 'email' | null;

/**
 * Sign-in methods, two-step sign-in, passkeys and sessions for the account page. Takes the
 * signed-in user's session, which the page has already checked.
 */
export async function getAccountSettings(current: { userId: string; sessionId: string }) {
  // Straight from the database: Better Auth's listSessions would check the
  // session cookie again first, a second round trip for the same answer.
  const [accounts, sessions, user, app, passkeys, trustedDevices] = await Promise.all([
    prisma.account.findMany({
      where: { userId: current.userId },
      select: { id: true, providerId: true },
    }),
    prisma.session.findMany({
      where: { userId: current.userId, expiresAt: { gt: new Date() } },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.user.findUniqueOrThrow({
      where: { id: current.userId },
      select: { twoFactorEnabled: true },
    }),
    // An authenticator app counts once its first code confirmed it.
    prisma.twoFactor.findFirst({
      where: { userId: current.userId, verified: { not: false } },
      select: { id: true },
    }),
    prisma.passkey.findMany({
      where: { userId: current.userId },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, createdAt: true, backedUp: true },
    }),
    prisma.verification.count({
      where: { ...trustedDevicesWhere(current.userId), expiresAt: { gt: new Date() } },
    }),
  ]);

  const twoFactor: TwoFactorMethod = !user.twoFactorEnabled ? null : app ? 'app' : 'email';

  return {
    /** Connected providers, plus `credential` for a password. */
    accounts,
    hasPassword: accounts.some((account) => account.providerId === 'credential'),
    twoFactor,
    trustedDevices,
    passkeys: passkeys.map((passkey) => ({ ...passkey, createdAt: passkey.createdAt?.toISOString() ?? null })),
    sessions: sessions.map((session) => ({
      id: session.id,
      device: describeUserAgent(session.userAgent),
      // Local development records an all-zero address; hide it.
      ipAddress: session.ipAddress && !/^[0:.]+$/.test(session.ipAddress) ? session.ipAddress : null,
      createdAt: session.createdAt.toISOString(),
      lastActive: session.updatedAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
      current: session.id === current.sessionId,
    })),
  };
}

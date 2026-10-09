import { PrismaPg } from '@prisma/adapter-pg';
import { randomBytes, randomUUID } from 'node:crypto';

import { PrismaClient } from '@/generated/client';
import { hashPassword } from '@/lib/password-hasher';

import { EMAIL_DOMAIN, databaseURL } from './env';

// Not the app's client from lib/prisma.ts, which reads DATABASE_URL.
export const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseURL() }) });

export const PASSWORD = 'e2e-password';

/** A username no other test has, e.g. e2e_3f9a1c2b, with its email. */
export function newAccount() {
  const username = `e2e_${randomBytes(4).toString('hex')}`;
  return { username, email: `${username}@${EMAIL_DOMAIN}` };
}

/**
 * An account to sign in to with PASSWORD, its email already verified, a
 * verified shark for each name in `sharks`, and `contact` for its matches.
 */
export async function createUser({ sharks = [], contact }: { sharks?: string[]; contact?: string } = {}) {
  const { username, email } = newAccount();
  const now = new Date();

  const user = await prisma.user.create({
    data: {
      username,
      email,
      emailVerified: true,
      matchContact: contact,
      profiles: { create: sharks.map((displayName) => ({ displayName, unit: 'CM', status: 'VERIFIED', submittedAt: now, verifiedAt: now })) },
    },
  });
  // Better Auth's password account: the user's id doubles as the account id.
  await prisma.account.create({
    data: { id: randomUUID(), accountId: user.id, providerId: 'credential', userId: user.id, password: await hashPassword(PASSWORD) },
  });

  return { id: user.id, username, email };
}

/** Removes every account the tests made, with their sharks and hearts. */
export async function clearTestAccounts() {
  await prisma.user.deleteMany({ where: { email: { endsWith: `@${EMAIL_DOMAIN}` } } });
}

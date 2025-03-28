'use server';

import { Profile } from '@prisma/client';
import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { COOKIE_SESSION_KEY, SESSION_EXPIRATION } from '@/constants/auth';
import { prisma } from '@/lib/prisma';
import { sessionSchema, sessionWithProfileSchema } from '@/lib/schemas';

export async function getUserSession({ includeProfile = false } = {}) {
  const cookie = await cookies();

  const sessionId = cookie.get(COOKIE_SESSION_KEY)?.value;

  if (sessionId == null) return null;

  const rawUser = await prisma.session.findFirst({
    where: { sessionId },
    include: includeProfile ? { Profile: true } : undefined,
  });

  const { success, data: user } = includeProfile ? sessionWithProfileSchema.safeParse(rawUser) : sessionSchema.safeParse(rawUser);
  return success ? user : null;
}

export async function createUserSession(profile: Profile) {
  const sessionId = randomBytes(512).toString('hex').normalize();

  const data = sessionSchema.parse({ sessionId: sessionId, profileId: profile.id });
  await prisma.session.create({
    data: {
      sessionId: data.sessionId,
      profileId: profile.id,
    },
  });

  const cookie = await cookies();
  cookie.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    expires: Date.now() + SESSION_EXPIRATION * 1000,
  });
}

export async function removeUserFromSession() {
  const cookie = await cookies();

  const sessionId = cookie.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return;

  await prisma.session.delete({
    where: { sessionId },
  });

  cookie.delete(COOKIE_SESSION_KEY);
}

export async function updateUserSession(session: z.infer<typeof sessionSchema>) {
  const cookie = await cookies();

  const sessionId = cookie.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return;

  await prisma.session.update({
    where: { sessionId },
    data: session,
  });
}

export async function updateUserSessionExpiration() {
  const cookie = await cookies();

  const session = await getUserSession();

  if (session == null) return null;

  cookie.set(COOKIE_SESSION_KEY, session.sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    expires: Date.now() + SESSION_EXPIRATION * 1000,
  });
}

import 'server-only';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { auth } from '@/lib/auth';

/**
 * The signed-in session, looked up once per request however often asked.
 * `user.name` is the username.
 */
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

/** Redirects to sign in if signed out. */
export async function requireUser() {
  const session = await getSession();
  if (!session) redirect('/sign-in');
  return session;
}

/** Redirects to the profiles page if already signed in, e.g. on sign-in pages. */
export async function requireSignedOut() {
  if (await getSession()) redirect('/dashboard/profiles');
}

export function isModerator(role: string | null | undefined) {
  return role === 'MODERATOR' || role === 'ADMIN';
}

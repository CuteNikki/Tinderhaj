'use server';

import { isAPIError } from 'better-auth/api';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { auth, forgetTrustedDevices as forget } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { QUERIES } from '@/lib/queries';
import { createProfileSchema, rejectProfileSchema, updateProfileSchema, updateUsernameSchema } from '@/lib/schemas';
import { getSession, isModerator, requireUser } from '@/lib/session';

export async function logOut() {
  await auth.api.signOut({ headers: await headers() });

  redirect('/');
}

export async function updateUsername(unsafeData: z.infer<typeof updateUsernameSchema>) {
  const { success, data } = updateUsernameSchema.safeParse(unsafeData);

  if (!success) return { message: 'Unable to update username!' };

  const session = await requireUser();

  if (session.user.name === data.username) return { message: 'That is already your username.' };

  // Better Auth checks the username is free (see lib/auth.ts).
  try {
    await auth.api.updateUser({ body: { name: data.username }, headers: await headers() });
  } catch (error) {
    if (isAPIError(error) && error.body?.code === 'USERNAME_TAKEN') {
      return { field: 'username', message: error.message };
    }
    console.error(error);
    return { message: 'Unable to update username!' };
  }

  revalidatePath('/account');
  revalidatePath('/profiles');
  revalidatePath('/discovery');
  revalidatePath('/verification');
}

/** For accounts without a password yet, e.g. signed up with a provider. */
export async function setPassword(newPassword: string) {
  try {
    await auth.api.setPassword({ body: { newPassword }, headers: await headers() });
  } catch (error) {
    if (isAPIError(error)) return { message: error.message };
    console.error(error);
    return { message: 'Unable to add a password!' };
  }

  revalidatePath('/account');
}

export async function revokeSession(sessionId: string) {
  const session = await getSession();
  if (!session) return { message: 'You are not signed in.' };

  // Looked up by id, so session tokens never have to be sent to the browser.
  const target = await prisma.session.findFirst({ where: { id: sessionId, userId: session.user.id } });
  if (!target) return { message: 'That session has already ended.' };

  await auth.api.revokeSession({ body: { token: target.token }, headers: await headers() });

  revalidatePath('/account');
}

export async function revokeOtherSessions() {
  await auth.api.revokeOtherSessions({ headers: await headers() });

  revalidatePath('/account');
}

/**
 * Makes every device ask for a code again, including this one. Their
 * "Don't ask again" cookies stay, but no longer count for anything.
 */
export async function forgetTrustedDevices() {
  const session = await getSession();
  if (!session) return { message: 'You are not signed in.' };

  await forget(session.user.id);

  revalidatePath('/account');
}

export async function createProfile(unsafeData: z.infer<typeof createProfileSchema>) {
  const { success, data } = createProfileSchema.safeParse(unsafeData);

  if (!success) return { message: 'Unable to create profile!' };

  const session = await requireUser();

  const profileCount = await prisma.profile.count({ where: { userId: session.user.id } });

  // Temporary MAX_PROFILES limit = 5
  if (profileCount >= 5) {
    return { message: `You have reached the maximum number of profiles (5)!` };
  }

  await prisma.profile.create({
    data: {
      ...data,
      userId: session.user.id,
      status: 'CREATED',
    },
  });

  revalidatePath('/profiles');
}

export async function updateProfile(unsafeData: z.infer<typeof updateProfileSchema>) {
  const { success, data } = updateProfileSchema.safeParse(unsafeData);

  if (!success) return { message: 'Unable to update profile!' };

  const session = await requireUser();
  const profiles = await QUERIES.getUserProfiles(session.user.id);

  if (!profiles.map((profile) => profile.id).includes(data.id)) {
    return { message: 'Profile not found or you do not have permission to update it.' };
  }

  const { id, isVerified: _isVerified, ...profileData } = data;

  await prisma.profile.update({
    where: { id },
    data: { ...profileData, status: 'CREATED', rejectedFields: [], rejectionNote: null },
  });

  revalidatePath('/profiles');
}

export async function submitProfileForReview({ profileId }: { profileId: string }) {
  const session = await requireUser();

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  });

  if (!profile || profile.userId !== session.user.id) {
    return { message: 'Profile not found or you do not have permission to submit it.' };
  }

  if (profile.status !== 'CREATED') {
    return { message: 'Only draft profiles can be submitted for review. Edit this profile to move it back to draft.' };
  }

  await prisma.profile.update({
    where: { id: profileId },
    data: { status: 'PENDING', submittedAt: new Date() },
  });

  revalidatePath('/profiles');
}

export async function deleteProfile({ profileId }: { profileId: string }) {
  const session = await requireUser();

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  });

  if (!profile || profile.userId !== session.user.id) {
    return { message: 'Profile not found or you do not have permission to delete it.' };
  }

  await prisma.profile.delete({
    where: { id: profileId },
  });

  revalidatePath('/profiles');
}

export async function verifyProfile({ profileId }: { profileId: string }) {
  const session = await requireUser();

  if (!isModerator(session.user.role)) return false;

  await prisma.profile.update({
    where: { id: profileId },
    data: { status: 'VERIFIED', rejectedFields: [], rejectionNote: null, verifiedAt: new Date() },
  });

  revalidatePath('/verification');
  revalidatePath('/profiles');
  return true;
}

export async function rejectProfile(unsafeData: z.infer<typeof rejectProfileSchema>) {
  const { success, data } = rejectProfileSchema.safeParse(unsafeData);

  if (!success) return { message: 'Unable to reject this profile.' };

  const session = await requireUser();

  if (!isModerator(session.user.role)) return { message: 'Unable to reject this profile.' };

  await prisma.profile.update({
    where: { id: data.profileId },
    data: { status: 'REJECTED', rejectedFields: data.rejectedFields, rejectionNote: data.note ?? null },
  });

  revalidatePath('/verification');
  revalidatePath('/profiles');
}

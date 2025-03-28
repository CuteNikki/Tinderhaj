'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { comparePasswords, generateSalt, hashPassword } from '@/lib/password-hasher';
import { prisma } from '@/lib/prisma';
import { signInSchema, signUpSchema, updateProfileSchema } from '@/lib/schemas';
import { createUserSession, getUserSession, removeUserFromSession } from '@/lib/session';
import { Profile } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData);

  if (!success) return { message: 'Unable to sign in!' };

  const profile = await prisma.profile.findFirst({
    where: { email: data.email },
  });

  if (profile == null) return { message: 'Unable to sign in!' };

  const isCorrectPassword = await comparePasswords({ hashedPassword: profile.password, password: data.password, salt: profile.salt });

  if (!isCorrectPassword) return { message: 'Unable to sign in!' };

  await createUserSession(profile);

  redirect('/');
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  const { success, data } = signUpSchema.safeParse(unsafeData);

  if (!success) return { message: 'Unable to create account!' };

  const existingUser = await prisma.profile.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingUser != null) {
    if (existingUser.email === data.email) {
      return { field: 'email', message: 'Email is already in use!' };
    }
    if (existingUser.username === data.username) {
      return { field: 'username', message: 'Username is already in use!' };
    }
    return { message: 'Unable to create account!' };
  }

  try {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    const profile = await prisma.profile.create({
      data: {
        email: data.email,
        password: hashedPassword,
        salt: salt,
        username: data.username,
        displayName: data.username,
        avatarUrl: `https://placehold.co/512x512/FF5733/FFFFFF/webp?text=${data.username[0].toUpperCase()}`,
        bannerUrl: `https://placehold.co/1144x572/FF5733/FFFFFF/webp?text=${data.username}`,
        birthday: new Date(),
        size: 0,
        pronouns: '',
        location: '',
        interests: [],
        bio: '',
        isVerified: false,
      },
    });

    if (profile == null) return { message: 'Unable to create account!' };

    await createUserSession(profile);
  } catch (error) {
    console.error(error);
    return { message: 'Unable to create account!' };
  }

  redirect('/');
}

function _getCurrentUser(options: { includeProfile: true; redirectIfNotFound: true }): Promise<{ sessionId: string; profileId: string; Profile: Profile }>;
function _getCurrentUser(options: {
  includeProfile: true;
  redirectIfNotFound: false;
}): Promise<{ sessionId: string; profileId: string; Profile: Profile } | null>;
function _getCurrentUser(options: { includeProfile: true }): Promise<{ sessionId: string; profileId: string; Profile: Profile } | null>;
function _getCurrentUser(options: { redirectIfNotFound: true }): Promise<{ sessionId: string; profileId: string }>;
function _getCurrentUser(options: { redirectIfFound: true }): Promise<{ sessionId: string; profileId: string }>;
function _getCurrentUser(options: { redirectIfNotFound: true }): Promise<{ sessionId: string; profileId: string } | null>;
function _getCurrentUser(): Promise<{ sessionId: string; profileId: string } | null>;
async function _getCurrentUser({ includeProfile = false, redirectIfNotFound = false, redirectIfFound = false } = {}) {
  const session = await getUserSession({ includeProfile });

  if (!session?.sessionId) {
    if (redirectIfNotFound) {
      redirect('/sign-in');
    }

    return null;
  }

  if (redirectIfFound) {
    return redirect('/');
  }

  return session;
}

export const getCurrentUser = _getCurrentUser;

export async function logOut() {
  await removeUserFromSession();

  redirect('/');
}

export async function updateProfile(unsafeData: z.infer<typeof updateProfileSchema>) {
  const { success, data } = updateProfileSchema.safeParse(unsafeData);

  if (!success) return { message: 'Unable to update profile!' };

  const session = await getCurrentUser({ includeProfile: true, redirectIfNotFound: true });

  await prisma.profile.update({
    where: { id: session.profileId },
    data: { ...data, isVerified: false },
  });

  revalidatePath('/profile');
}

export async function deleteProfile() {
  const session = await getCurrentUser({ includeProfile: true, redirectIfNotFound: true });

  await removeUserFromSession(); // Delete session

  // Delete profile
  await prisma.profile.delete({
    where: { id: session.profileId },
  });
}

export async function verifyProfile(profileId: string) {
  const session = await getCurrentUser({ includeProfile: true, redirectIfNotFound: true });

  if (!session?.Profile?.canVerify) return false;

  await prisma.profile.update({
    where: { id: profileId },
    data: { isVerified: true },
  });

  revalidatePath('/dashboard');
  return true;
}

export async function resetProfile(profileId: string) {
  const session = await getCurrentUser({ includeProfile: true, redirectIfNotFound: true });

  if (!session?.Profile?.canVerify) return false;

  await prisma.profile.update({
    where: { id: profileId },
    data: { isVerified: false, bio: 'reset', interests: [], location: 'reset', pronouns: 'reset', size: 0, birthday: new Date() },
  });

  revalidatePath('/dashboard');
  return true;
}

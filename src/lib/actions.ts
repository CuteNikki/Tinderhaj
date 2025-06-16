'use server';

import { Account } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { comparePasswords, generateSalt, hashPassword } from '@/lib/password-hasher';
import { prisma } from '@/lib/prisma';
import { createProfileSchema, signInSchema, signUpSchema, updateProfileSchema } from '@/lib/schemas';
import { createUserSession, getUserSession, removeUserFromSession } from '@/lib/session';

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData);

  if (!success) return { message: 'Unable to sign in!' };

  const account = await prisma.account.findFirst({
    where: { email: data.email },
  });

  if (account == null) return { message: 'Unable to sign in!' };

  const isCorrectPassword = await comparePasswords({ hashedPassword: account.password, password: data.password, salt: account.salt });

  if (!isCorrectPassword) return { message: 'Unable to sign in!' };

  await createUserSession(account);

  redirect('/');
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  const { success, data } = signUpSchema.safeParse(unsafeData);

  if (!success) return { message: 'Unable to create account!' };

  const existingUser = await prisma.account.findFirst({
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

    const account = await prisma.account.create({
      data: {
        email: data.email,
        password: hashedPassword,
        salt: salt,
        username: data.username,
      },
    });

    if (account == null) return { message: 'Unable to create account!' };

    await createUserSession(account);
  } catch (error) {
    console.error(error);
    return { message: 'Unable to create account!' };
  }

  redirect('/');
}

function _getCurrentUser(options: { includeAccount: true; redirectIfNotFound: true }): Promise<{ sessionId: string; accountId: string; Account: Account }>;
function _getCurrentUser(options: {
  includeAccount: true;
  redirectIfNotFound: false;
}): Promise<{ sessionId: string; accountId: string; Account: Account } | null>;
function _getCurrentUser(options: { includeAccount: true }): Promise<{ sessionId: string; accountId: string; Account: Account } | null>;
function _getCurrentUser(options: { redirectIfNotFound: true }): Promise<{ sessionId: string; accountId: string }>;
function _getCurrentUser(options: { redirectIfFound: true }): Promise<{ sessionId: string; accountId: string }>;
function _getCurrentUser(options: { redirectIfNotFound: true }): Promise<{ sessionId: string; accountId: string } | null>;
function _getCurrentUser(): Promise<{ sessionId: string; accountId: string } | null>;
async function _getCurrentUser({ includeAccount = false, redirectIfNotFound = false, redirectIfFound = false } = {}) {
  const session = await getUserSession({ includeAccount });

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

export const getCurrentProfiles = async () => {
  const session = await getCurrentUser({ includeAccount: true, redirectIfNotFound: true });

  return prisma.profile.findMany({
    where: { accountId: session.accountId },
    include: { Account: true },
    orderBy: { id: 'asc' },
  });
};

export const getCurrentProfileCount = async () => {
  const session = await getCurrentUser({ includeAccount: true, redirectIfNotFound: true });

  return prisma.profile.count({
    where: { accountId: session.accountId },
  });
};

export async function logOut() {
  await removeUserFromSession();

  redirect('/');
}

export async function createProfile(unsafeData: z.infer<typeof createProfileSchema>) {
  const { success, data } = createProfileSchema.safeParse(unsafeData);

  if (!success) return { message: 'Unable to create profile!' };

  const session = await getCurrentUser({ includeAccount: true, redirectIfNotFound: true });

  await prisma.profile.create({
    data: {
      ...data,
      avatarUrl: 'https://placehold.co/512x512/33FF57/FFFFFF/webp?text=SOON',
      bannerUrl: 'https://placehold.co/1144x572/33FF57/FFFFFF/webp?text=SOON',
      accountId: session.accountId,
    },
  });

  revalidatePath('/profiles');
}

export async function updateProfile(unsafeData: z.infer<typeof updateProfileSchema>) {
  const { success, data } = updateProfileSchema.safeParse(unsafeData);

  if (!success) return { message: 'Unable to update profile!' };

  const profiles = await getCurrentProfiles();

  if (!profiles.map((profile) => profile.id).includes(data.id)) {
    return { message: 'Profile not found or you do not have permission to update it.' };
  }

  await prisma.profile.update({
    where: { id: data.id },
    data: { ...data, isVerified: false },
  });

  revalidatePath('/profiles');
}

export async function deleteProfile({ profileId }: { profileId: string }) {
  const session = await getCurrentUser({ includeAccount: true, redirectIfNotFound: true });

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: { Account: true },
  });

  if (!profile || profile.Account?.id !== session.accountId) {
    return { message: 'Profile not found or you do not have permission to delete it.' };
  }

  await prisma.profile.delete({
    where: { id: profileId },
  });

  revalidatePath('/profiles');
}

export async function verifyProfile({ profileId }: { profileId: string }) {
  const session = await getCurrentUser({ includeAccount: true, redirectIfNotFound: true });

  if (!session?.Account?.canVerify) return false;

  await prisma.profile.update({
    where: { id: profileId },
    data: { isVerified: true },
  });

  revalidatePath('/dashboard');
  return true;
}

export async function resetProfile({ profileId }: { profileId: string }) {
  const session = await getCurrentUser({ includeAccount: true, redirectIfNotFound: true });

  if (!session?.Account?.canVerify) return false;

  await prisma.profile.update({
    where: { id: profileId },
    data: { isVerified: false, bio: 'reset', interests: [], location: 'reset', pronouns: 'reset', size: 0, birthday: new Date() },
  });

  revalidatePath('/dashboard');
  return true;
}

'use server';

import { createHash, randomBytes } from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { PASSWORD_RESET_TOKEN_EXPIRATION } from '@/constants/auth';
import { AccountModel } from '@/generated/models';
import { sendPasswordResetEmail } from '@/lib/email';
import { comparePasswords, generateSalt, hashPassword } from '@/lib/password-hasher';
import prisma from '@/lib/prisma';
import {
  createProfileSchema,
  forgotPasswordSchema,
  rejectProfileSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  updateProfileSchema,
} from '@/lib/schemas';
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

  redirect('/profiles');
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

  redirect('/profiles');
}

const GENERIC_RESET_MESSAGE = 'If an account with that email exists, a password reset link has been sent.';

export async function requestPasswordReset(unsafeData: z.infer<typeof forgotPasswordSchema>) {
  const { success, data } = forgotPasswordSchema.safeParse(unsafeData);

  if (!success) return { message: 'Unable to process request!' };

  const account = await prisma.account.findFirst({ where: { email: data.email } });

  // Always respond the same way to avoid leaking which emails are registered.
  if (account == null) return { message: GENERIC_RESET_MESSAGE };

  try {
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    await prisma.passwordResetToken.deleteMany({ where: { accountId: account.id } });
    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        accountId: account.id,
        expiresAt: new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRATION * 1000),
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${rawToken}`;
    await sendPasswordResetEmail({ email: account.email, resetUrl });
  } catch (error) {
    console.error(error);
  }

  return { message: GENERIC_RESET_MESSAGE };
}

export async function resetPassword(unsafeData: z.infer<typeof resetPasswordSchema>) {
  const { success, data } = resetPasswordSchema.safeParse(unsafeData);

  if (!success) return { message: 'Unable to reset password!' };

  const tokenHash = createHash('sha256').update(data.token).digest('hex');

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (resetToken == null || resetToken.expiresAt < new Date()) {
    return { message: 'This reset link is invalid or has expired!' };
  }

  const salt = generateSalt();
  const hashedPassword = await hashPassword(data.password, salt);

  await prisma.$transaction([
    prisma.account.update({
      where: { id: resetToken.accountId },
      data: { password: hashedPassword, salt },
    }),
    prisma.passwordResetToken.deleteMany({ where: { accountId: resetToken.accountId } }),
    prisma.session.deleteMany({ where: { accountId: resetToken.accountId } }),
  ]);

  redirect('/sign-in');
}

function _getCurrentUser(options: { includeAccount: true; redirectIfNotFound: true }): Promise<{ sessionId: string; accountId: string; account: AccountModel }>;
function _getCurrentUser(options: {
  includeAccount: true;
  redirectIfNotFound: false;
}): Promise<{ sessionId: string; accountId: string; account: AccountModel } | null>;
function _getCurrentUser(options: { includeAccount: true }): Promise<{ sessionId: string; accountId: string; account: AccountModel } | null>;
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
    return redirect('/profiles');
  }

  return session;
}

export const getCurrentUser = _getCurrentUser;

export const getCurrentProfiles = async () => {
  const session = await getCurrentUser({ includeAccount: true, redirectIfNotFound: true });

  return prisma.profile.findMany({
    where: { accountId: session.accountId },
    include: { account: true },
    orderBy: { createdAt: 'asc' },
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

  const profileCount = await getCurrentProfileCount();

  // Temporary MAX_PROFILES limit = 5
  if (profileCount >= 5) {
    return { message: `You have reached the maximum number of profiles (5)!` };
  }

  await prisma.profile.create({
    data: {
      ...data,
      accountId: session.accountId,
      status: 'CREATED',
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

  const { id, isVerified: _isVerified, ...profileData } = data;

  await prisma.profile.update({
    where: { id },
    data: { ...profileData, status: 'CREATED', rejectedFields: [], rejectionNote: null },
  });

  revalidatePath('/profiles');
}

export async function submitProfileForReview({ profileId }: { profileId: string }) {
  const session = await getCurrentUser({ includeAccount: true, redirectIfNotFound: true });

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: { account: true },
  });

  if (!profile || profile.account?.id !== session.accountId) {
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
  const session = await getCurrentUser({ includeAccount: true, redirectIfNotFound: true });

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: { account: true },
  });

  if (!profile || profile.account?.id !== session.accountId) {
    return { message: 'Profile not found or you do not have permission to delete it.' };
  }

  await prisma.profile.delete({
    where: { id: profileId },
  });

  revalidatePath('/profiles');
}

export async function verifyProfile({ profileId }: { profileId: string }) {
  const session = await getCurrentUser({ includeAccount: true, redirectIfNotFound: true });

  if (session.account.role !== 'MODERATOR' && session.account.role !== 'ADMIN') return false;

  await prisma.profile.update({
    where: { id: profileId },
    data: { status: 'VERIFIED', rejectedFields: [], rejectionNote: null, verifiedAt: new Date() },
  });

  revalidatePath('/verify');
  revalidatePath('/profiles');
  return true;
}

export async function rejectProfile(unsafeData: z.infer<typeof rejectProfileSchema>) {
  const { success, data } = rejectProfileSchema.safeParse(unsafeData);

  if (!success) return { message: 'Unable to reject this profile.' };

  const session = await getCurrentUser({ includeAccount: true, redirectIfNotFound: true });

  if (session.account.role !== 'MODERATOR' && session.account.role !== 'ADMIN') return { message: 'Unable to reject this profile.' };

  await prisma.profile.update({
    where: { id: data.profileId },
    data: { status: 'REJECTED', rejectedFields: data.rejectedFields, rejectionNote: data.note ?? null },
  });

  revalidatePath('/verify');
  revalidatePath('/profiles');
}

'use server';

import { isAPIError } from 'better-auth/api';
import { revalidatePath, updateTag } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { auth, forgetTrustedDevices as forget } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { MAX_PROFILES } from '@/constants/auth';
import { PROFILE_COUNT_TAG, QUERIES } from '@/lib/queries';
import { BAN_REASON_MAX, banExpiry, isBanDuration, isBanned } from '@/lib/bans';
import { HEARTS_PER_DAY, liveProfileWhere } from '@/lib/hearts';
import { REPORTS_PER_DAY, reportSchema } from '@/lib/reports';
import { canBan, canManageAccount, isAdmin, isRole } from '@/lib/roles';
import { createProfileSchema, rejectProfileSchema, updateMatchContactSchema, updateProfileSchema, updateUsernameSchema } from '@/lib/schemas';
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

  revalidatePath('/dashboard/account');
  revalidatePath('/dashboard/profiles');
  revalidatePath('/discovery');
  revalidatePath('/moderation/verification');
  // Their sharks' cards show it
  updateTag(PROFILE_COUNT_TAG);
}

/** What the owners of sharks that match one of theirs see, to reach them. Empty shares nothing. */
export async function updateMatchContact(unsafeData: z.infer<typeof updateMatchContactSchema>) {
  const { success, data, error } = updateMatchContactSchema.safeParse(unsafeData);

  if (!success) return { message: error.issues[0]?.message ?? 'Unable to save how matches can reach you!' };

  const session = await requireUser();

  await prisma.user.update({ where: { id: session.user.id }, data: { matchContact: data.contact || null } });

  revalidatePath('/dashboard/account');
  revalidatePath('/dashboard/hearts');
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

  revalidatePath('/dashboard/account');
}

export async function revokeSession(sessionId: string) {
  const session = await getSession();
  if (!session) return { message: 'You are not signed in.' };

  // Looked up by id, so session tokens never have to be sent to the browser.
  const target = await prisma.session.findFirst({ where: { id: sessionId, userId: session.user.id } });
  if (!target) return { message: 'That session has already ended.' };

  await auth.api.revokeSession({ body: { token: target.token }, headers: await headers() });

  revalidatePath('/dashboard/account');
}

export async function revokeOtherSessions() {
  await auth.api.revokeOtherSessions({ headers: await headers() });

  revalidatePath('/dashboard/account');
}

/**
 * Makes every device ask for a code again, including this one. Their
 * "Don't ask again" cookies stay, but no longer count for anything.
 */
export async function forgetTrustedDevices() {
  const session = await getSession();
  if (!session) return { message: 'You are not signed in.' };

  await forget(session.user.id);

  revalidatePath('/dashboard/account');
}

/**
 * The signed-in moderator or admin, and the account they want to act on,
 * which mustn't be their own.
 */
async function moderationTarget(userId: string) {
  const session = await requireUser();
  if (session.user.id === userId) return { error: { message: 'You can’t do that to your own account.' } } as const;

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true, email: true, role: true } });
  if (!target) return { error: { message: 'That account doesn’t exist anymore.' } } as const;

  return { session, target } as const;
}

function revalidateUser(userId: string) {
  revalidatePath('/moderation/users');
  revalidatePath(`/moderation/users/${userId}`);
}

/** Admins change anyone's role but their own, so there's always an admin left. */
export async function setUserRole(userId: string, role: string) {
  const found = await moderationTarget(userId);
  if (found.error) return found.error;

  if (!isAdmin(found.session.user.role)) return { message: 'Only admins can change roles.' };
  if (!isRole(role)) return { message: 'Unknown role.' };
  if (role === 'ADMIN') {
    // Nobody can ban or unban an admin, so their ban could never be lifted.
    const ban = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { banned: true, banExpires: true } });
    if (isBanned(ban)) return { message: 'Lift their ban before making them an admin.' };
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });

  revalidateUser(userId);
}

/** Signs them out everywhere and stops them signing in until the ban ends or is lifted. */
export async function banUser(userId: string, input: { reason: string; duration: string }) {
  const found = await moderationTarget(userId);
  if (found.error) return found.error;

  const { session, target } = found;
  if (!canBan(session.user.role, target.role)) return { message: 'You can’t ban this account.' };
  if (!isBanDuration(input.duration)) return { message: 'Unknown ban length.' };

  const reason = input.reason.trim().slice(0, BAN_REASON_MAX) || null;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { banned: true, banReason: reason, banExpires: banExpiry(input.duration), bannedAt: new Date(), bannedById: session.user.id },
    }),
    prisma.session.deleteMany({ where: { userId } }),
  ]);

  revalidateUser(userId);
  revalidatePath('/discovery');
  updateTag(PROFILE_COUNT_TAG);
}

export async function unbanUser(userId: string) {
  const found = await moderationTarget(userId);
  if (found.error) return found.error;

  if (!canBan(found.session.user.role, found.target.role)) return { message: 'You can’t lift this ban.' };

  await prisma.user.update({
    where: { id: userId },
    data: { banned: false, banReason: null, banExpires: null, bannedAt: null, bannedById: null },
  });

  revalidateUser(userId);
  revalidatePath('/discovery');
  updateTag(PROFILE_COUNT_TAG);
}

export async function signOutUserEverywhere(userId: string) {
  const found = await moderationTarget(userId);
  if (found.error) return found.error;

  if (!canManageAccount(found.session.user.role, found.target.role)) return { message: 'Only admins can sign others out.' };

  await prisma.session.deleteMany({ where: { userId } });

  revalidateUser(userId);
}

/** Also works for accounts made with a provider: the link adds a password. */
export async function sendUserPasswordReset(userId: string) {
  const found = await moderationTarget(userId);
  if (found.error) return found.error;

  if (!canManageAccount(found.session.user.role, found.target.role)) return { message: 'Only admins can send password resets.' };

  await auth.api.requestPasswordReset({ body: { email: found.target.email, redirectTo: '/reset-password' } });
}

/** Deletes the account with all its profiles, right away. */
export async function deleteUserAccount(userId: string) {
  const found = await moderationTarget(userId);
  if (found.error) return found.error;

  if (!canManageAccount(found.session.user.role, found.target.role)) return { message: 'Only admins can delete accounts.' };

  await prisma.user.delete({ where: { id: userId } });

  revalidatePath('/moderation/users');
  revalidatePath('/discovery');
  updateTag(PROFILE_COUNT_TAG);
  revalidatePath('/moderation/verification');
}

export async function createProfile(unsafeData: z.infer<typeof createProfileSchema>) {
  const { success, data } = createProfileSchema.safeParse(unsafeData);

  if (!success) return { message: 'Unable to create profile!' };

  const session = await requireUser();

  const profileCount = await prisma.profile.count({ where: { userId: session.user.id } });

  if (profileCount >= MAX_PROFILES) {
    return { message: `You have reached the maximum number of profiles (${MAX_PROFILES})!` };
  }

  await prisma.profile.create({
    data: {
      ...data,
      userId: session.user.id,
      status: 'CREATED',
    },
  });

  revalidatePath('/dashboard/profiles');
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

  revalidatePath('/dashboard/profiles');
  updateTag(PROFILE_COUNT_TAG);
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

  revalidatePath('/dashboard/profiles');
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

  revalidatePath('/dashboard/profiles');
  updateTag(PROFILE_COUNT_TAG);
}

export async function verifyProfile({ profileId }: { profileId: string }) {
  const session = await requireUser();

  if (!isModerator(session.user.role)) return false;

  await prisma.profile.update({
    where: { id: profileId },
    data: { status: 'VERIFIED', rejectedFields: [], rejectionNote: null, verifiedAt: new Date() },
  });

  revalidatePath('/moderation/verification');
  revalidatePath('/dashboard/profiles');
  updateTag(PROFILE_COUNT_TAG);
  return true;
}

/**
 * Undoes a verification, e.g. one made by mistake: the profile leaves
 * discovery and goes back to waiting for review. Its hearts stay, hidden
 * until it's verified again.
 */
export async function unverifyProfile({ profileId }: { profileId: string }) {
  const session = await requireUser();

  if (!isModerator(session.user.role)) return { message: 'Only moderators can unverify profiles.' };

  const { count } = await prisma.profile.updateMany({
    where: { id: profileId, status: 'VERIFIED' },
    data: { status: 'PENDING', verifiedAt: null, submittedAt: new Date() },
  });
  if (!count) return { message: 'That profile isn’t verified anymore.' };

  revalidatePath('/moderation/verification');
  revalidatePath('/moderation/users', 'layout');
  revalidatePath('/discovery');
  revalidatePath('/dashboard/profiles');
  updateTag(PROFILE_COUNT_TAG);
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

  revalidatePath('/moderation/verification');
  revalidatePath('/dashboard/profiles');
  updateTag(PROFILE_COUNT_TAG);
}

/**
 * One of the user's verified sharks hearts someone else's live shark.
 * Returns whether that made a match.
 */
export async function sendHeart({ fromProfileId, toProfileId }: { fromProfileId: string; toProfileId: string }) {
  const session = await requireUser();

  const from = await prisma.profile.findFirst({ where: { id: fromProfileId, userId: session.user.id }, select: { status: true, displayName: true } });
  if (!from) return { message: 'That shark isn’t yours.' };
  if (from.status !== 'VERIFIED') return { message: 'Only verified sharks can send hearts.' };

  const to = await prisma.profile.findFirst({ where: { id: toProfileId, ...liveProfileWhere() }, select: { userId: true } });
  if (!to) return { message: 'That shark isn’t around anymore.' };
  if (to.userId === session.user.id) return { message: 'Your sharks can’t heart each other.' };

  const today = await prisma.heart.count({ where: { fromProfileId, createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } });
  if (today >= HEARTS_PER_DAY) return { message: `${from.displayName} has sent ${HEARTS_PER_DAY} hearts today. Try again tomorrow.` };

  // Sending twice does nothing.
  await prisma.heart.createMany({ data: { fromProfileId, toProfileId }, skipDuplicates: true });
  const back = await prisma.heart.count({ where: { fromProfileId: toProfileId, toProfileId: fromProfileId } });

  revalidatePath('/discovery');
  revalidatePath('/dashboard/hearts');
  return { matched: back > 0 };
}

/** Takes a heart back, which also ends a match. */
export async function takeBackHeart({ fromProfileId, toProfileId }: { fromProfileId: string; toProfileId: string }) {
  const session = await requireUser();

  const { count } = await prisma.heart.deleteMany({ where: { fromProfileId, toProfileId, from: { userId: session.user.id } } });
  if (!count) return { message: 'That heart was already taken back.' };

  revalidatePath('/discovery');
  revalidatePath('/dashboard/hearts');
}

/** Called when they open their hearts, so the nav stops pointing at them. */
export async function markHeartsSeen() {
  const session = await requireUser();

  await prisma.heart.updateMany({ where: { seenAt: null, to: { userId: session.user.id } }, data: { seenAt: new Date() } });
}

/**
 * Tells moderators a shark breaks the rules, or, for a match, the way to
 * reach its owner does.
 */
export async function reportProfile(unsafeData: z.input<typeof reportSchema>) {
  const { success, data, error } = reportSchema.safeParse(unsafeData);
  if (!success) return { message: error.issues[0]?.message ?? 'Unable to send the report!' };

  const session = await requireUser();

  const profile = await prisma.profile.findFirst({
    where: { id: data.profileId, ...liveProfileWhere() },
    select: { userId: true, user: { select: { matchContact: true } } },
  });
  if (!profile) return { message: 'That shark isn’t around anymore.' };
  if (profile.userId === session.user.id) return { message: 'You can’t report your own shark.' };

  // Only a match sees how to reach the owner, so only a match can report it,
  // and the copy for moderators comes from here rather than the browser.
  let contactNote: string | null = null;
  if (data.contact) {
    const match = await prisma.heart.findFirst({
      where: { fromProfileId: data.profileId, to: { userId: session.user.id, heartsSent: { some: { toProfileId: data.profileId } } } },
      select: { id: true },
    });
    if (!match || !profile.user.matchContact) return { message: 'Only a match can report how to reach this shark’s owner.' };
    contactNote = profile.user.matchContact;
  }

  const [open, today] = await Promise.all([
    prisma.report.count({
      where: { reporterId: session.user.id, profileId: data.profileId, status: 'OPEN', contactNote: data.contact ? { not: null } : null },
    }),
    prisma.report.count({ where: { reporterId: session.user.id, createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
  ]);
  if (open) return { message: 'You’ve reported this already. A moderator will look at it soon.' };
  if (today >= REPORTS_PER_DAY) return { message: `That’s ${REPORTS_PER_DAY} reports today. Try again tomorrow, or write to us.` };

  await prisma.report.create({
    data: { profileId: data.profileId, reporterId: session.user.id, reason: data.reason, details: data.details || null, contactNote },
  });

  revalidatePath('/moderation/reports');
}

/** Closes a report: dealt with (`RESOLVED`), or nothing wrong (`DISMISSED`). */
export async function handleReport({ reportId, outcome }: { reportId: string; outcome: 'RESOLVED' | 'DISMISSED' }) {
  const session = await requireUser();

  if (!isModerator(session.user.role)) return { message: 'You need moderator access to handle reports.' };
  if (outcome !== 'RESOLVED' && outcome !== 'DISMISSED') return { message: 'Unknown outcome.' };

  const { count } = await prisma.report.updateMany({
    where: { id: reportId, status: 'OPEN' },
    data: { status: outcome, handledAt: new Date(), handledById: session.user.id },
  });
  if (!count) return { message: 'Someone already handled this report.' };

  revalidatePath('/moderation/reports');
}

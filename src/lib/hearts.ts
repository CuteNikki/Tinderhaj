import 'server-only';

import { Prisma, ProfileStatus } from '@/generated/client';
import { notBannedWhere } from '@/lib/bans';
import prisma from '@/lib/prisma';
import { PUBLIC_PROFILE, type PublicProfile } from '@/lib/queries';
import { isModerator } from '@/lib/session';

/** How many hearts one shark can send in a day. */
export const HEARTS_PER_DAY = 50;

/** Sharks others can see and heart: verified, from accounts that aren't banned. */
export function liveProfileWhere(): Prisma.ProfileWhereInput {
  return { status: ProfileStatus.VERIFIED, user: notBannedWhere() };
}

/** What a heart list shows of a shark: enough for a row with its picture. */
const SHARK = {
  id: true,
  displayName: true,
  avatarUrl: true,
  pronouns: true,
  user: { select: { username: true } },
} satisfies Prisma.ProfileSelect;

export type Shark = Prisma.ProfileGetPayload<{ select: typeof SHARK }>;

/** One of the viewer's verified sharks, and where it stands with a shark on a card. */
export type HeartState = { shark: Shark; sent: boolean; received: boolean };

/**
 * For each of `profileIds`, the viewer's verified sharks and where each
 * stands with it: a heart sent, one received, or both (a match). One query
 * for a whole page of cards.
 */
export async function getHeartStates(userId: string, profileIds: string[]): Promise<Record<string, HeartState[]>> {
  if (!profileIds.length) return {};

  const sharks = await prisma.profile.findMany({
    where: { userId, status: ProfileStatus.VERIFIED },
    select: {
      ...SHARK,
      heartsSent: { where: { toProfileId: { in: profileIds } }, select: { toProfileId: true } },
      heartsReceived: { where: { fromProfileId: { in: profileIds } }, select: { fromProfileId: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  return Object.fromEntries(
    profileIds.map((profileId) => [
      profileId,
      sharks
        .filter((shark) => shark.id !== profileId)
        .map(({ heartsSent, heartsReceived, ...shark }) => ({
          shark,
          sent: heartsSent.some((heart) => heart.toProfileId === profileId),
          received: heartsReceived.some((heart) => heart.fromProfileId === profileId),
        })),
    ]),
  );
}

export type HeartRow = {
  id: string;
  mine: Shark;
  theirs: PublicProfile;
  at: Date;
  unseen: boolean;
  /** For matches: how their owner can be reached, if they said. */
  contact?: string | null;
};

/**
 * Hearts between the user's sharks and live sharks of others, split into
 * matches (both ways), received (only to them) and sent (only from them).
 * Newest first. Also whether the user shares a way for matches to reach them.
 */
export async function getHearts(userId: string) {
  const live = liveProfileWhere();
  const [received, sent, user] = await Promise.all([
    prisma.heart.findMany({
      where: { to: { userId }, from: { ...live, userId: { not: userId } } },
      select: { id: true, createdAt: true, seenAt: true, from: { select: PUBLIC_PROFILE }, to: { select: SHARK } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.heart.findMany({
      where: { from: { userId }, to: { ...live, userId: { not: userId } } },
      select: { id: true, createdAt: true, from: { select: SHARK }, to: { select: PUBLIC_PROFILE } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { matchContact: true } }),
  ]);

  const pair = (mine: string, theirs: string) => `${mine}:${theirs}`;
  const sentPairs = new Map(sent.map((heart) => [pair(heart.from.id, heart.to.id), heart]));
  const receivedPairs = new Set(received.map((heart) => pair(heart.to.id, heart.from.id)));

  const matches: HeartRow[] = [];
  const onlyReceived: HeartRow[] = [];
  for (const heart of received) {
    const back = sentPairs.get(pair(heart.to.id, heart.from.id));
    const row = { id: heart.id, mine: heart.to, theirs: heart.from, unseen: !heart.seenAt };
    // A match dates from whichever heart came second.
    if (back) matches.push({ ...row, at: back.createdAt > heart.createdAt ? back.createdAt : heart.createdAt });
    else onlyReceived.push({ ...row, at: heart.createdAt });
  }
  const onlySent: HeartRow[] = sent
    .filter((heart) => !receivedPairs.has(pair(heart.from.id, heart.to.id)))
    .map((heart) => ({ id: heart.id, mine: heart.from, theirs: heart.to, at: heart.createdAt, unseen: false }));

  matches.sort((a, b) => b.at.getTime() - a.at.getTime());

  // How to reach the other owner, asked for only once it's a match, so it never travels with any other heart.
  const owners = matches.length
    ? await prisma.profile.findMany({
        where: { id: { in: matches.map((row) => row.theirs.id) } },
        select: { id: true, user: { select: { matchContact: true } } },
      })
    : [];
  const contacts = new Map(owners.map((profile) => [profile.id, profile.user.matchContact]));
  for (const row of matches) row.contact = contacts.get(row.theirs.id) ?? null;

  return { matches, received: onlyReceived, sent: onlySent, sharesContact: !!user?.matchContact };
}

/** Hearts to the user's sharks they haven't seen yet, for the nav. */
export async function countUnseenHearts(userId: string) {
  return prisma.heart.count({ where: { seenAt: null, to: { userId }, from: { ...liveProfileWhere(), userId: { not: userId } } } });
}

/**
 * Someone's page: their name, when they joined, and their live sharks. Hidden
 * while they're banned, except from moderators, who also see every shark.
 */
export async function getUserPage(username: string, viewer: { id: string; role?: string | null } | null) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, createdAt: true, banned: true, banExpires: true },
  });
  if (!user) return null;

  const moderator = isModerator(viewer?.role);
  const banned = user.banned && (!user.banExpires || user.banExpires > new Date());
  if (banned && !moderator) return null;

  const sharks = await prisma.profile.findMany({
    where: { userId: user.id, status: ProfileStatus.VERIFIED },
    select: PUBLIC_PROFILE,
    orderBy: { createdAt: 'asc' },
  });

  return { user: { id: user.id, username: user.username, createdAt: user.createdAt }, sharks, banned, own: viewer?.id === user.id, moderator };
}

/**
 * One verified shark, for its own page, by its id: the username in its link
 * only says whose it is, so a link still finds it after its owner renames
 * themselves. Null if it isn't verified, or its owner is banned, but for
 * moderators.
 */
export async function getSharkPage(id: string, viewer: { id: string; role?: string | null } | null) {
  const shark = await prisma.profile.findUnique({
    where: { id, status: ProfileStatus.VERIFIED },
    select: { ...PUBLIC_PROFILE, userId: true, user: { select: { username: true, banned: true, banExpires: true } } },
  });
  if (!shark) return null;

  const moderator = isModerator(viewer?.role);
  const { userId, user, ...rest } = shark;
  const banned = user.banned && (!user.banExpires || user.banExpires > new Date());
  if (banned && !moderator) return null;

  return { shark: { ...rest, user: { username: user.username } } satisfies PublicProfile, userId, banned, own: viewer?.id === userId, moderator };
}

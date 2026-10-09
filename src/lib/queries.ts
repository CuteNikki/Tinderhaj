import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { AccountRole, Prisma, ProfileStatus } from '@/generated/client';
import prisma from '@/lib/prisma';
import { notBannedWhere } from '@/lib/bans';
import { FRESH_PROFILE_WINDOW_IN_DAYS } from '@/lib/profile-status';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

/** Only the owner's username: profiles go to the browser, emails mustn't. */
const PROFILE_OWNER = { user: { select: { username: true } } } satisfies Prisma.ProfileInclude;

export type ProfileWithOwner = Prisma.ProfileGetPayload<{ include: typeof PROFILE_OWNER }>;

/** What anyone may see of a profile: what its card shows. For cards rendered in the browser. */
export const PUBLIC_PROFILE = {
  id: true,
  displayName: true,
  avatarUrl: true,
  bannerUrl: true,
  birthday: true,
  size: true,
  unit: true,
  pronouns: true,
  location: true,
  interests: true,
  bio: true,
  status: true,
  verifiedAt: true,
  createdAt: true,
  user: { select: { username: true } },
} satisfies Prisma.ProfileSelect;

export type PublicProfile = Prisma.ProfileGetPayload<{ select: typeof PUBLIC_PROFILE }>;

function getProfileShuffle(profileId: string, seed: number) {
  let hash = 0;

  for (const character of `${seed}:${profileId}`) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash / 0xffffffff;
}

function rankDiscoveryProfiles(profiles: ProfileWithOwner[], seed: number) {
  const now = Date.now();

  return profiles
    .map((profile) => {
      const verifiedAt = profile.verifiedAt ?? profile.createdAt;
      const verifiedAgeInDays = Math.max(0, (now - verifiedAt.getTime()) / DAY_IN_MS);
      const freshnessBoost = Math.max(0, FRESH_PROFILE_WINDOW_IN_DAYS - verifiedAgeInDays) / FRESH_PROFILE_WINDOW_IN_DAYS;
      const shuffledPosition = getProfileShuffle(profile.id, seed);

      return { profile, score: freshnessBoost * 0.7 + shuffledPosition * 0.3 };
    })
    .sort((left, right) => right.score - left.score)
    .map(({ profile }) => profile);
}

async function getRankedDiscoveryProfiles(where: Prisma.ProfileWhereInput, page: number, take: number, seed: number) {
  const profiles = rankDiscoveryProfiles(
    await prisma.profile.findMany({
      // Banned accounts' profiles stay out of discovery while the ban lasts.
      where: { AND: [where, { user: notBannedWhere() }] },
      include: PROFILE_OWNER,
    }),
    seed,
  );

  return {
    profiles: profiles.slice((page - 1) * take, page * take),
    totalProfiles: profiles.length,
  };
}

/** Refreshed by the actions that change which profiles discovery shows, or how they look (see lib/actions.ts). */
export const PROFILE_COUNT_TAG = 'profile-count';

/**
 * How many profiles discovery can show: verified, from accounts that aren't
 * banned. Cached, so the home page stays prerendered.
 */
export async function getDiscoverableProfileCount() {
  'use cache';
  cacheLife('hours');
  cacheTag(PROFILE_COUNT_TAG);

  return prisma.profile.count({ where: { status: ProfileStatus.VERIFIED, user: notBannedWhere() } });
}

/** The newest profiles discovery shows, newest first. Cached, like the count. */
export async function getNewestSharks(take = 3) {
  'use cache';
  cacheLife('hours');
  cacheTag(PROFILE_COUNT_TAG);

  return prisma.profile.findMany({
    where: { status: ProfileStatus.VERIFIED, user: notBannedWhere() },
    select: PUBLIC_PROFILE,
    orderBy: { verifiedAt: 'desc' },
    take,
  });
}

export const QUERIES = {
  getAccountCount: async () => {
    return await prisma.user.count();
  },

  getUserProfiles: async (userId: string) => {
    return prisma.profile.findMany({ where: { userId }, include: PROFILE_OWNER, orderBy: { createdAt: 'asc' } });
  },

  getProfilesWithQuery: async (query: string, page: number, take: number, seed: number) => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery.length) return getRankedDiscoveryProfiles({ status: ProfileStatus.VERIFIED }, page, take, seed);

    // Prisma cannot do partial, case-insensitive matches inside scalar-list elements.
    const verifiedInterests = await prisma.profile.findMany({
      where: { status: ProfileStatus.VERIFIED },
      select: { interests: true },
    });
    const matchingInterests = Array.from(new Set(verifiedInterests.flatMap((profile) => profile.interests))).filter((interest) =>
      interest.toLowerCase().includes(normalizedQuery.toLowerCase()),
    );

    const where: Prisma.ProfileWhereInput = {
      OR: [
        { user: { username: { contains: normalizedQuery, mode: 'insensitive' } } },
        { displayName: { contains: normalizedQuery, mode: 'insensitive' } },
        { bio: { contains: normalizedQuery, mode: 'insensitive' } },
        { location: { contains: normalizedQuery, mode: 'insensitive' } },
        ...(matchingInterests.length ? [{ interests: { hasSome: matchingInterests } }] : []),
      ],
      status: ProfileStatus.VERIFIED,
    };
    return getRankedDiscoveryProfiles(where, page, take, seed);
  },

  getProfiles: async (page: number, take: number, seed: number) => {
    return getRankedDiscoveryProfiles({ status: ProfileStatus.VERIFIED }, page, take, seed);
  },

  /**
   * People for the users page, highest role first, then by username. `show`
   * is a role, or BANNED for accounts banned right now. Emails are only
   * searched and returned for admins.
   */
  getUsers: async ({
    query,
    show,
    page,
    take,
    withEmail,
  }: {
    query: string;
    show: AccountRole | 'BANNED' | null;
    page: number;
    take: number;
    withEmail: boolean;
  }) => {
    const search = query.trim();
    const bannedNow = { banned: true, OR: [{ banExpires: null }, { banExpires: { gt: new Date() } }] } satisfies Prisma.UserWhereInput;
    const where: Prisma.UserWhereInput = {
      AND: [
        show === 'BANNED' ? bannedNow : show ? { role: show } : {},
        search
          ? {
              OR: [
                { username: { contains: search, mode: 'insensitive' } },
                ...(withEmail ? [{ email: { contains: search, mode: 'insensitive' as const } }] : []),
              ],
            }
          : {},
      ],
    };

    const [users, total, counts, banned] = await Promise.all([
      prisma.user.findMany({
        where,
        // Enums sort in declaration order: USER, MODERATOR, ADMIN.
        orderBy: [{ role: 'desc' }, { username: 'asc' }],
        skip: (page - 1) * take,
        take,
        select: {
          id: true,
          username: true,
          email: withEmail,
          role: true,
          banned: true,
          banExpires: true,
          createdAt: true,
          _count: { select: { profiles: true } },
        },
      }),
      prisma.user.count({ where }),
      prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
      prisma.user.count({ where: bannedNow }),
    ]);

    return {
      users,
      total,
      /** Everyone per role, and banned, ignoring the search, for the filter. */
      counts: { ...(Object.fromEntries(counts.map((count) => [count.role, count._count._all])) as Partial<Record<AccountRole, number>>), BANNED: banned },
    };
  },

  /** Everything the user page shows. The email only for admins. */
  getUserDetail: async (id: string, withEmail: boolean) => {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: withEmail,
        emailVerified: true,
        twoFactorEnabled: true,
        role: true,
        banned: true,
        banReason: true,
        banExpires: true,
        bannedAt: true,
        bannedBy: { select: { id: true, username: true } },
        createdAt: true,
        accounts: { select: { providerId: true } },
        _count: { select: { passkeys: true, sessions: { where: { expiresAt: { gt: new Date() } } } } },
        profiles: { include: PROFILE_OWNER, orderBy: { createdAt: 'asc' } },
      },
    });
  },

  /** How many profiles wait for review, for the moderation menu. */
  getPendingProfileCount: async () => {
    return prisma.profile.count({ where: { status: ProfileStatus.PENDING } });
  },

  /** The latest verified profiles, newest first, in case one was verified by mistake. */
  getRecentlyVerified: async () => {
    return prisma.profile.findMany({
      where: { status: ProfileStatus.VERIFIED, verifiedAt: { not: null } },
      select: PUBLIC_PROFILE,
      orderBy: { verifiedAt: 'desc' },
      take: 12,
    });
  },

  getPendingProfiles: async () => {
    return prisma.profile.findMany({ where: { status: ProfileStatus.PENDING }, include: PROFILE_OWNER, orderBy: { submittedAt: 'asc' } });
  },
};

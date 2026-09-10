import 'server-only';

import { Prisma, ProfileStatus } from '@/generated/client';
import prisma from '@/lib/prisma';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const FRESH_PROFILE_WINDOW_IN_DAYS = 1;

type DiscoveryProfile = Prisma.ProfileGetPayload<{ include: { account: true } }>;

function getProfileShuffle(profileId: string, seed: number) {
  let hash = 0;

  for (const character of `${seed}:${profileId}`) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash / 0xffffffff;
}

function rankDiscoveryProfiles(profiles: DiscoveryProfile[], seed: number) {
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
      where,
      include: { account: true },
    }),
    seed,
  );

  return {
    profiles: profiles.slice((page - 1) * take, page * take),
    totalProfiles: profiles.length,
  };
}

export const QUERIES = {
  getAccountCount: async () => {
    return await prisma.account.count();
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
        { account: { username: { contains: normalizedQuery, mode: 'insensitive' } } },
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

  getPendingProfiles: async () => {
    return prisma.profile.findMany({ where: { status: ProfileStatus.PENDING }, include: { account: true }, orderBy: { submittedAt: 'asc' } });
  },
};

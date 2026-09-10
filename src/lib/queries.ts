import 'server-only';

import { Prisma, ProfileStatus } from '@/generated/client';
import prisma from '@/lib/prisma';

export const QUERIES = {
  getAccountCount: async () => {
    return await prisma.account.count();
  },

  getProfilesWithQuery: async (query: string, page: number, take: number) => {
    // Prisma's array filters (`has`/`hasSome`) only do exact, case-sensitive matches, with no
    // partial/case-insensitive option for array elements. Since there's no native way to search
    // *inside* each tag, find which existing tags contain the query, then match against those.
    const verifiedInterests = await prisma.profile.findMany({
      where: { status: ProfileStatus.VERIFIED },
      select: { interests: true },
    });
    const matchingInterests = Array.from(new Set(verifiedInterests.flatMap((profile) => profile.interests))).filter((interest) =>
      interest.toLowerCase().includes(query.toLowerCase()),
    );

    const where: Prisma.ProfileWhereInput = {
      OR: [
        { account: { username: { contains: query, mode: 'insensitive' } } },
        { displayName: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
        ...(matchingInterests.length ? [{ interests: { hasSome: matchingInterests } }] : []),
      ],
      status: ProfileStatus.VERIFIED,
    };
    return {
      profiles: await prisma.profile.findMany({
        skip: (page - 1) * take,
        take: take,
        where: where,
        include: { account: true },
        orderBy: { verifiedAt: 'desc' },
      }),
      totalProfiles: await prisma.profile.count({ where }),
    };
  },

  getProfiles: async (page: number, take: number) => {
    return {
      profiles: await prisma.profile.findMany({
        skip: (page - 1) * take,
        take: take,
        where: { status: ProfileStatus.VERIFIED },
        include: { account: true },
        orderBy: { verifiedAt: 'desc' },
      }),
      totalProfiles: await prisma.profile.count({ where: { status: ProfileStatus.VERIFIED } }),
    };
  },

  getPendingProfiles: async () => {
    return prisma.profile.findMany({ where: { status: ProfileStatus.PENDING }, include: { account: true }, orderBy: { submittedAt: 'asc' } });
  },
};

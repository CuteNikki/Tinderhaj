import 'server-only';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const QUERIES = {
  getProfileCount: async () => {
    return await prisma.profile.count();
  },

  getProfilesWithQuery: async (query: string, page: number, take: number) => {
    const where: Prisma.ProfileWhereInput = {
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { displayName: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
        { interests: { has: query } },
      ],
    };
    return {
      profiles: await prisma.profile.findMany({ skip: (page - 1) * take, take: take, where: where }),
      totalProfiles: await prisma.profile.count({ where }),
    };
  },

  getProfiles: async (page: number, take: number) => {
    return { profiles: await prisma.profile.findMany({ skip: (page - 1) * take, take: take }), totalProfiles: await prisma.profile.count() };
  },
};

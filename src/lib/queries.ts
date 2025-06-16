import 'server-only';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const QUERIES = {
  getAccountCount: async () => {
    return await prisma.account.count();
  },

  getProfilesWithQuery: async (query: string, page: number, take: number) => {
    const where: Prisma.ProfileWhereInput = {
      OR: [
        { Account: { username: { contains: query, mode: 'insensitive' } } },
        { displayName: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
        { interests: { has: query } },
      ],
      isVerified: true,
    };
    return {
      profiles: await prisma.profile.findMany({ skip: (page - 1) * take, take: take, where: where, include: { Account: true } }),
      totalProfiles: await prisma.profile.count({ where }),
    };
  },

  getProfiles: async (page: number, take: number) => {
    return {
      profiles: await prisma.profile.findMany({ skip: (page - 1) * take, take: take, where: { isVerified: true }, include: { Account: true } }),
      totalProfiles: await prisma.profile.count({ where: { isVerified: true } }),
    };
  },

  getUnverifiedProfiles: async () => {
    return prisma.profile.findMany({ where: { isVerified: false }, include: { Account: true } });
  },
};

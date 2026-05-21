import 'server-only';

import { Prisma, ProfileStatus } from '@/generated/client';
import prisma from '@/lib/prisma';

export const QUERIES = {
  getAccountCount: async () => {
    return await prisma.account.count();
  },

  getProfilesWithQuery: async (query: string, page: number, take: number) => {
    const where: Prisma.ProfileWhereInput = {
      OR: [
        { account: { username: { contains: query, mode: 'insensitive' } } },
        { displayName: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
        { interests: { has: query } },
      ],
      status: ProfileStatus.VERIFIED,
    };
    return {
      profiles: await prisma.profile.findMany({ skip: (page - 1) * take, take: take, where: where, include: { account: true } }),
      totalProfiles: await prisma.profile.count({ where }),
    };
  },

  getProfiles: async (page: number, take: number) => {
    return {
      profiles: await prisma.profile.findMany({ skip: (page - 1) * take, take: take, where: { status: ProfileStatus.VERIFIED }, include: { account: true } }),
      totalProfiles: await prisma.profile.count({ where: { status: ProfileStatus.VERIFIED } }),
    };
  },

  getPendingProfiles: async () => {
    return prisma.profile.findMany({ where: { status: ProfileStatus.PENDING }, include: { account: true } });
  },
};

import 'server-only';

import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

export const QUERIES = {
  getUserCount: async () => {
    return await prisma.user.count();
  },

  filterUsers: async (query: string, page: number, take: number) => {
    const where: Prisma.UserWhereInput = {
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { displayName: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
        { interests: { has: query } },
      ],
    };
    return { users: await prisma.user.findMany({ skip: (page - 1) * take, take: take, where: where }), totalUsers: await prisma.user.count({ where }) };
  },

  getUsers: async (page: number, take: number) => {
    return { users: await prisma.user.findMany({ skip: (page - 1) * take, take: take }), totalUsers: await prisma.user.count() };
  },
};

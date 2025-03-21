import 'server-only';

import { connection } from 'next/server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const QUERIES = {
  filterUsers: async (query: string, page: number, take: number) => {
    await connection();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const where: Prisma.UserWhereInput = {
      OR: [{ username: { contains: query, mode: 'insensitive' } }, { display_name: { contains: query, mode: 'insensitive' } }],
    };
    return {
      users: await prisma.user.findMany({ skip: (page - 1) * take, take: take, where: where }),
      count: await prisma.user.count({ where }),
    };
  },

  getUsers: async (page: number, take: number) => {
    await connection();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      users: await prisma.user.findMany({ skip: (page - 1) * take, take: take, orderBy: { username: 'desc' } }),
      count: await prisma.user.count(),
    };
  },
};

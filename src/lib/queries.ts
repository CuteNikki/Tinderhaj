import 'server-only';

import { connection } from 'next/server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const QUERIES = {
  filterUsers: async (query: string, page: number, take: number) => {
    await connection();
    const where: Prisma.UserWhereInput = {
      OR: [{ username: { contains: query, mode: 'insensitive' } }, { display_name: { contains: query, mode: 'insensitive' } }],
    };
    return { users: await prisma.user.findMany({ skip: (page - 1) * take, take: take, where: where }), totalUsers: await prisma.user.count({ where }) };
  },

  getUsers: async (page: number, take: number) => {
    await connection();
    return { users: await prisma.user.findMany({ skip: (page - 1) * take, take: take, orderBy: { username: 'desc' } }), totalUsers: await prisma.user.count() };
  },
};

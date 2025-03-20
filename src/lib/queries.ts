import 'server-only';

import prisma from '@/lib/prisma';

export const QUERIES = {
  getUsers: async () => {
    return prisma.user.findMany();
  },
};

import 'server-only';

import { ProfileStatus } from '@/generated/client';

import { notBannedWhere } from '@/lib/bans';
import prisma from '@/lib/prisma';

/**
 * How many friends someone brought: accounts that signed up through their
 * invite link and have a verified shark, so a throwaway account doesn't count.
 */
export async function countInvites(userId: string) {
  return prisma.user.count({
    where: {
      invitedById: userId,
      ...notBannedWhere(),
      profiles: { some: { status: ProfileStatus.VERIFIED } },
    },
  });
}

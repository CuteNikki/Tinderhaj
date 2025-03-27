'use server';

import { prisma } from '@/lib/prisma';

export async function deleteProfile() {
  // get username from current session
  const username = 'nikki';

  // delete profile
  await prisma.profile.delete({
    where: { username },
  });
}

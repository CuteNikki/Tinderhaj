'use server';

import prisma from '@/lib/prisma';

export async function deleteUser() {
  // get username from current session
  const username = 'nikki';

  // delete user
  await prisma.user.delete({
    where: { username },
  });
}

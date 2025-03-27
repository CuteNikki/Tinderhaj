'use server';

import { signIn } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function logIn(provider: 'discord' | 'github' | 'google') {
  await signIn(provider, { redirectTo: '/' });
}

export async function deleteProfile() {
  // get username from current session
  const username = 'nikki';

  // delete profile
  await prisma.profile.delete({
    where: { username },
  });
}

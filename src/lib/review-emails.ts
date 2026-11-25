import 'server-only';

import { after } from 'next/server';

import { isBanned } from '@/lib/bans';
import { sendSharkRejectedEmail, sendSharkVerifiedEmail } from '@/lib/email';
import prisma from '@/lib/prisma';
import { profileFieldLabel } from '@/lib/profile-fields';
import { siteURL } from '@/lib/site-url';
import { unsubscribeUrls } from '@/lib/unsubscribe';
import { sharkPath } from '@/lib/utils';

/**
 * A reviewed shark and its owner, if they can be emailed: a confirmed address,
 * so a typo doesn't reach a stranger, and not banned.
 */
async function reviewedShark(profileId: string) {
  const shark = await prisma.profile.findUnique({
    where: { id: profileId },
    select: {
      id: true,
      displayName: true,
      rejectedFields: true,
      rejectionNote: true,
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          emailVerified: true,
          verifiedEmails: true,
          banned: true,
          banExpires: true,
        },
      },
    },
  });
  if (!shark?.user.emailVerified || isBanned(shark.user)) return null;
  return shark;
}

/**
 * Emails a shark's owner that it's verified, once the response has gone,
 * unless they turned these off. A failed send is only logged, as the shark is
 * verified all the same.
 */
export function emailVerifiedLater(profileId: string, again: boolean) {
  after(async () => {
    try {
      const shark = await reviewedShark(profileId);
      if (!shark?.user.verifiedEmails) return;
      await sendSharkVerifiedEmail({
        email: shark.user.email,
        username: shark.user.username,
        shark: shark.displayName,
        url: new URL(sharkPath(shark), siteURL).href,
        again,
        unsubscribe: unsubscribeUrls(shark.user.id, 'verified'),
      });
    } catch (error) {
      console.error(`Failed to email that ${profileId} is verified`, error);
    }
  });
}

/**
 * Emails a shark's owner what to change before it can go live, once the
 * response has gone. Always, as it's the answer to what they asked for. A
 * failed send is only logged: the dashboard says it too.
 */
export function emailRejectedLater(profileId: string) {
  after(async () => {
    try {
      const shark = await reviewedShark(profileId);
      if (!shark) return;
      await sendSharkRejectedEmail({
        email: shark.user.email,
        username: shark.user.username,
        shark: shark.displayName,
        fields: shark.rejectedFields.map(profileFieldLabel),
        note: shark.rejectionNote,
        url: new URL(`/dashboard/profiles/${shark.id}/edit`, siteURL).href,
      });
    } catch (error) {
      console.error(`Failed to email that ${profileId} was rejected`, error);
    }
  });
}

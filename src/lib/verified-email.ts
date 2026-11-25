import 'server-only';

import { after } from 'next/server';

import { isBanned } from '@/lib/bans';
import { sendSharkVerifiedEmail } from '@/lib/email';
import prisma from '@/lib/prisma';
import { siteURL } from '@/lib/site-url';
import { unsubscribeUrls } from '@/lib/unsubscribe';
import { sharkPath } from '@/lib/utils';

/**
 * Emails a shark's owner that it's verified, once the response has gone:
 * unless they turned these off, or have no confirmed address to send to. A
 * failed send is only logged, as the shark is verified all the same.
 */
export function emailVerifiedLater(profileId: string, again: boolean) {
  after(async () => {
    try {
      const shark = await prisma.profile.findUnique({
        where: { id: profileId },
        select: {
          id: true,
          displayName: true,
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
      if (!shark) return;
      const { user } = shark;
      if (!user.verifiedEmails || !user.emailVerified || isBanned(user)) return;

      await sendSharkVerifiedEmail({
        email: user.email,
        username: user.username,
        shark: shark.displayName,
        url: new URL(sharkPath(shark), siteURL).href,
        again,
        unsubscribe: unsubscribeUrls(user.id, 'verified'),
      });
    } catch (error) {
      console.error(`Failed to email that ${profileId} is verified`, error);
    }
  });
}

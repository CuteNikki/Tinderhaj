import 'server-only';

import { after } from 'next/server';

import { isBanned } from '@/lib/bans';
import { sendMatchEmail } from '@/lib/email';
import prisma from '@/lib/prisma';
import { siteURL } from '@/lib/site-url';
import { unsubscribeUrls } from '@/lib/unsubscribe';

/**
 * Emails the owner of `mineId` that `theirsId` just hearted it back, once the
 * response has gone: they hearted first, so they weren't there to see it.
 * Unless they turned these off, or have no confirmed address to send to. A
 * failed send is only logged, as the match stands all the same.
 */
export function emailMatchLater(mineId: string, theirsId: string) {
  after(async () => {
    try {
      const [mine, theirs] = await Promise.all(
        [mineId, theirsId].map((id) =>
          prisma.profile.findUnique({
            where: { id },
            select: {
              displayName: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  emailVerified: true,
                  matchEmails: true,
                  banned: true,
                  banExpires: true,
                },
              },
            },
          })
        )
      );
      if (!mine || !theirs) return;
      const owner = mine.user;
      if (!owner.matchEmails || !owner.emailVerified || isBanned(owner)) return;

      await sendMatchEmail({
        email: owner.email,
        username: owner.username,
        mine: mine.displayName,
        theirs: theirs.displayName,
        theirOwner: theirs.user.username,
        url: new URL('/dashboard/hearts?tab=matches', siteURL).href,
        unsubscribe: unsubscribeUrls(owner.id, 'matches'),
      });
    } catch (error) {
      console.error(`Failed to email ${mineId} about its match`, error);
    }
  });
}

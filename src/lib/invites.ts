import 'server-only';

import { after } from 'next/server';

import { INVITE_BADGES } from '@/constants/invites';
import { ProfileStatus } from '@/generated/client';

import { isBanned, notBannedWhere } from '@/lib/bans';
import { sendInviteJoinedEmail } from '@/lib/email';
import prisma from '@/lib/prisma';
import { siteURL } from '@/lib/site-url';
import { unsubscribeUrls } from '@/lib/unsubscribe';
import { sharkPath } from '@/lib/utils';

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

/**
 * Emails whoever invited a shark's owner, once the response has gone, when
 * this shark is the owner's first verified one: the moment they count. Unless
 * the inviter turned these off, or has no confirmed address to send to. A
 * failed send is only logged, as the shark is verified all the same.
 */
export function emailInviterLater(profileId: string) {
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
              banned: true,
              banExpires: true,
              invitedBy: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  emailVerified: true,
                  inviteEmails: true,
                  banned: true,
                  banExpires: true,
                },
              },
            },
          },
        },
      });
      const friend = shark?.user;
      const inviter = friend?.invitedBy;
      if (!shark || !friend || !inviter || isBanned(friend)) return;
      if (!inviter.inviteEmails || !inviter.emailVerified || isBanned(inviter))
        return;

      // Only their first verified shark: they already counted for any later one
      const verified = await prisma.profile.count({
        where: { userId: friend.id, status: ProfileStatus.VERIFIED },
      });
      if (verified !== 1) return;

      const count = await countInvites(inviter.id);
      await sendInviteJoinedEmail({
        email: inviter.email,
        username: inviter.username,
        friend: friend.username,
        shark: shark.displayName,
        url: new URL(sharkPath(shark), siteURL).href,
        count,
        badge:
          INVITE_BADGES.find((badge) => badge.count === count)?.label ?? null,
        unsubscribe: unsubscribeUrls(inviter.id, 'invites'),
      });
    } catch (error) {
      console.error(`Failed to email the inviter of ${profileId}`, error);
    }
  });
}

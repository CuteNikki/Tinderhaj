import 'server-only';

import { after } from 'next/server';

import { SITE_URL } from '@/constants/metadata';
import { isBanned } from '@/lib/bans';
import { discord } from '@/lib/discord';
import prisma from '@/lib/prisma';

/**
 * Newly verified sharks, posted to a channel on the Tinderhaj Discord server by
 * the site's bot as a link Discord shows as the shark's card. Off unless
 * DISCORD_BOT_TOKEN and DISCORD_CHANNEL_NEW_SHARKS are set; the bot needs View
 * Channel, Send Messages and Embed Links in that channel.
 */
export function newSharkFeedEnabled() {
  return !!process.env.DISCORD_BOT_TOKEN && !!process.env.DISCORD_CHANNEL_NEW_SHARKS;
}

/** Discord's markdown in a name, shown as typed rather than formatting the message. */
function escapeMarkdown(text: string) {
  return text.replace(/[\\*_~`|>#[\]]/g, '\\$&');
}

/**
 * Posts a shark that's just been verified for the first time, after the
 * response has gone out. Checked again then, so a shark unverified or an owner
 * banned in the meantime isn't posted.
 */
export function announceNewSharkLater(profileId: string) {
  if (!newSharkFeedEnabled()) return;
  after(async () => {
    try {
      const shark = await prisma.profile.findUnique({
        where: { id: profileId },
        select: { id: true, displayName: true, status: true, user: { select: { username: true, banned: true, banExpires: true } } },
      });
      if (!shark || shark.status !== 'VERIFIED' || isBanned(shark.user)) return;

      const link = new URL(`/u/${shark.user.username}/${shark.id}`, SITE_URL).href;
      const response = await discord('POST', `/channels/${process.env.DISCORD_CHANNEL_NEW_SHARKS}/messages`, {
        reason: 'Tinderhaj new shark',
        // A name can't ping anyone, whatever it says.
        body: { content: `🦈 Say hi to **${escapeMarkdown(shark.displayName)}**, fresh on Tinderhaj! 💙\n${link}`, allowed_mentions: { parse: [] } },
      });
      if (!response.ok) throw new Error(`Posting shark ${shark.id}: ${response.status} ${await response.text()}`);
    } catch (error) {
      console.error('Discord new shark post failed', error);
    }
  });
}

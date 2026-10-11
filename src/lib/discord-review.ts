import 'server-only';

import { after } from 'next/server';

import { SITE_URL } from '@/constants/metadata';
import { discord } from '@/lib/discord';
import prisma from '@/lib/prisma';
import { profileFieldLabel } from '@/lib/profile-fields';

/**
 * Sharks waiting for review, posted to a channel only moderators see on the
 * Tinderhaj Discord server. Each message is edited to say how the review went,
 * and removed if the shark leaves the queue some other way (taken back to
 * edit, or deleted). Off unless DISCORD_BOT_TOKEN and
 * DISCORD_CHANNEL_REVIEW_QUEUE are set; the bot needs View Channel, Send
 * Messages and Embed Links in that channel.
 */
function reviewQueueEnabled() {
  return !!process.env.DISCORD_BOT_TOKEN && !!process.env.DISCORD_CHANNEL_REVIEW_QUEUE;
}

/** Messages built from components (containers, text, buttons) instead of content and embeds. */
const COMPONENTS_V2 = 1 << 15;

/** Each state in the Website Moderator, Verified Shark Owner and Website Admin role colours. */
const ACCENT = { waiting: 0xff9f6b, verified: 0x5aa8ee, rejected: 0xe8475f };

function escapeMarkdown(text: string) {
  return text.replace(/[\\*_~`|>#[\]]/g, '\\$&');
}

const reviewSelect = {
  id: true,
  displayName: true,
  avatarUrl: true,
  pronouns: true,
  size: true,
  unit: true,
  location: true,
  status: true,
  submittedAt: true,
  verifiedAt: true,
  rejectedFields: true,
  rejectionNote: true,
  reviewMessageId: true,
  user: { select: { id: true, username: true } },
} as const;

type ReviewShark = NonNullable<Awaited<ReturnType<typeof findShark>>>;

function findShark(profileId: string) {
  return prisma.profile.findUnique({ where: { id: profileId }, select: reviewSelect });
}

function linkButton(label: string, path: string) {
  return { type: 2, style: 5, label, url: new URL(path, SITE_URL).href };
}

/** The moderator who verified or rejected a shark: their session's user. */
type Reviewer = { id: string; name: string };

/** Someone's name, linked to their page for moderators, where all their sharks show in any state. */
function userLink(id: string, username: string) {
  return `**[${escapeMarkdown(username)}](${new URL(`/moderation/users/${id}`, SITE_URL).href})**`;
}

/** A Discord timestamp, shown in each reader's own time. */
function timestamp(date: Date) {
  return `<t:${Math.floor(date.getTime() / 1000)}:R>`;
}

/**
 * The message for a shark: a small label for where it is, its name and
 * details, and once reviewed, how that went and who did it.
 */
function reviewMessage(shark: ReviewShark, reviewer?: Reviewer) {
  const reviewPath = `/moderation/verification/${shark.id}`;
  let accent = ACCENT.waiting;
  // Edits keep when a shark was first verified, so one with a date has been on Tinderhaj before.
  let label = shark.verifiedAt ? 'Edited shark' : 'New shark';
  let button = linkButton('Review', reviewPath);
  const outcome: string[] = [];

  if (shark.status === 'VERIFIED') {
    accent = ACCENT.verified;
    label = 'Verified';
    button = linkButton('View shark', `/u/${shark.user.username}/${shark.id}`);
  } else if (shark.status === 'REJECTED') {
    accent = ACCENT.rejected;
    label = 'Rejected';
    button = linkButton('Open review', reviewPath);
    if (shark.rejectedFields.length) outcome.push(`**Needs fixing:** ${shark.rejectedFields.map(profileFieldLabel).join(', ')}`);
    if (shark.rejectionNote) outcome.push(`> ${escapeMarkdown(shark.rejectionNote).replace(/\n/g, '\n> ')}`);
  }
  if (reviewer) outcome.push(`-# ${label} by ${userLink(reviewer.id, reviewer.name)} ${timestamp(new Date())}`);

  const details = [shark.pronouns, shark.size != null && `${shark.size}${shark.unit.toLowerCase()}`, shark.location]
    .filter(Boolean)
    .map((detail) => escapeMarkdown(String(detail)));
  const from = `From ${userLink(shark.user.id, shark.user.username)}${shark.submittedAt ? `, sent ${timestamp(shark.submittedAt)}` : ''}`;
  const text = {
    type: 10,
    content: [`-# ${label.toUpperCase()}`, `## ${escapeMarkdown(shark.displayName)}`, details.join(' · '), `-# ${from}`].filter(Boolean).join('\n'),
  };
  // Only web addresses, since Discord refuses the whole message over a thumbnail it can't load.
  const avatar = shark.avatarUrl && /^https?:\/\//.test(shark.avatarUrl) ? shark.avatarUrl : null;

  return {
    flags: COMPONENTS_V2,
    allowed_mentions: { parse: [] },
    components: [
      {
        type: 17,
        accent_color: accent,
        components: [
          avatar ? { type: 9, components: [text], accessory: { type: 11, media: { url: avatar } } } : text,
          ...(outcome.length
            ? [
                { type: 14, divider: true, spacing: 1 },
                { type: 10, content: outcome.join('\n') },
              ]
            : []),
          { type: 1, components: [button] },
        ],
      },
    ],
  };
}

function messagePath(messageId: string) {
  return `/channels/${process.env.DISCORD_CHANNEL_REVIEW_QUEUE}/messages/${messageId}`;
}

/**
 * Posts a shark that's just been sent for review, after the response has gone
 * out. If a moderator got to it before the post was saved, the message goes
 * again, since there's nothing left to review.
 */
export function postReviewLater(profileId: string) {
  if (!reviewQueueEnabled()) return;
  after(async () => {
    try {
      const shark = await findShark(profileId);
      if (!shark || shark.status !== 'PENDING') return;

      const response = await discord('POST', `/channels/${process.env.DISCORD_CHANNEL_REVIEW_QUEUE}/messages`, {
        reason: 'Tinderhaj shark to review',
        body: reviewMessage(shark),
      });
      if (!response.ok) throw new Error(`Posting shark ${shark.id}: ${response.status} ${await response.text()}`);

      const { id } = (await response.json()) as { id: string };
      const { count } = await prisma.profile.updateMany({ where: { id: profileId, status: 'PENDING' }, data: { reviewMessageId: id } });
      if (!count) await discord('DELETE', messagePath(id), { reason: 'Tinderhaj shark reviewed already' });
    } catch (error) {
      console.error('Discord review post failed', error);
    }
  });
}

/** Edits a shark's message to show it was verified or rejected, and by whom. */
export function settleReviewLater(profileId: string, reviewer: Reviewer) {
  if (!reviewQueueEnabled()) return;
  after(async () => {
    try {
      const shark = await findShark(profileId);
      if (!shark?.reviewMessageId || (shark.status !== 'VERIFIED' && shark.status !== 'REJECTED')) return;

      await prisma.profile.update({ where: { id: profileId }, data: { reviewMessageId: null } });
      const response = await discord('PATCH', messagePath(shark.reviewMessageId), {
        reason: 'Tinderhaj shark reviewed',
        body: reviewMessage(shark, reviewer),
      });
      if (!response.ok) throw new Error(`Editing review of shark ${shark.id}: ${response.status} ${await response.text()}`);
    } catch (error) {
      console.error('Discord review edit failed', error);
    }
  });
}

/** Removes messages for sharks that left the queue without a review. Pass the ids before they're cleared. */
export function dropReviewsLater(messageIds: (string | null | undefined)[]) {
  const ids = messageIds.filter((id): id is string => !!id);
  if (!reviewQueueEnabled() || !ids.length) return;
  after(async () => {
    for (const id of ids) {
      try {
        const response = await discord('DELETE', messagePath(id), { reason: 'Tinderhaj shark left the review queue' });
        // Already gone, e.g. removed by hand, is fine.
        if (!response.ok && response.status !== 404) throw new Error(`Removing review ${id}: ${response.status} ${await response.text()}`);
      } catch (error) {
        console.error('Discord review removal failed', error);
      }
    }
  });
}

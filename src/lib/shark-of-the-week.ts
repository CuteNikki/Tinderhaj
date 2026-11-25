import 'server-only';

import { randomInt } from 'crypto';
import { cacheLife, cacheTag } from 'next/cache';

import { ProfileStatus } from '@/generated/client';

import { isBanned, notBannedWhere } from '@/lib/bans';
import { sendSharkOfTheWeekEmail } from '@/lib/email';
import prisma from '@/lib/prisma';
import { PUBLIC_PROFILE } from '@/lib/queries';
import { siteURL } from '@/lib/site-url';
import { unsubscribeUrls } from '@/lib/unsubscribe';
import { sharkPath } from '@/lib/utils';
import { isoWeek } from '@/lib/weeks';

export const SHARK_OF_THE_WEEK_TAG = 'shark-of-the-week';

const DAY = 24 * 60 * 60 * 1000;
const WEEK = 7 * DAY;
/** How long a shark waits before it can be picked again: about half a year. */
const COOLDOWN = 26 * WEEK;
/** How recently a shark was verified to count as new, and get a better chance. */
const NEW_FOR = 30 * DAY;
/** At most this many of a week's hearts count toward its chance, so the most hearted don't always win. */
const HEARTS_CAP = 10;

/**
 * How likely a shark is to be picked, against the others: everyone has a
 * chance, more for the hearts it got this week (up to HEARTS_CAP), for each
 * part of its profile that's filled in, and for being new.
 */
function weight(
  shark: {
    bio: string | null;
    bannerUrl: string | null;
    birthday: Date | null;
    location: string | null;
    pronouns: string | null;
    interests: string[];
    verifiedAt: Date | null;
  },
  hearts: number,
  now: Date
) {
  const filled = [
    shark.bio,
    shark.bannerUrl,
    shark.birthday,
    shark.location,
    shark.pronouns,
    shark.interests.length > 0,
  ].filter(Boolean).length;
  const fresh =
    shark.verifiedAt && now.getTime() - shark.verifiedAt.getTime() < NEW_FOR;
  return 2 + Math.min(hearts, HEARTS_CAP) + filled + (fresh ? 4 : 0);
}

/**
 * Draws the week's Shark of the Week if it has none yet, and emails its
 * owner. Who can be drawn: verified sharks with a photo, of accounts that
 * aren't banned, not picked in the last half year, nor skipped this week.
 * If every one has had a turn in the last half year, any of them but this
 * week's skipped ones.
 * Under a lock, so two servers can't each draw one.
 */
export async function pickSharkOfTheWeek(now = new Date()) {
  const week = isoWeek(now);

  const picked = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('shark-of-the-week'))`;
    if (await tx.sharkOfTheWeek.findFirst({ where: { week, skipped: false } }))
      return null;

    // Sharks that can be drawn: not skipped this week, nor picked within `cooldown` ms
    const drawable = (cooldown: number) =>
      tx.profile.findMany({
        where: {
          status: ProfileStatus.VERIFIED,
          avatarUrl: { not: null },
          user: notBannedWhere(),
          featured: {
            none: {
              OR: [
                { week },
                {
                  skipped: false,
                  createdAt: { gt: new Date(now.getTime() - cooldown) },
                },
              ],
            },
          },
        },
        select: {
          id: true,
          bio: true,
          bannerUrl: true,
          birthday: true,
          location: true,
          pronouns: true,
          interests: true,
          verifiedAt: true,
        },
      });

    const [fresh, recent] = await Promise.all([
      drawable(COOLDOWN),
      tx.heart.groupBy({
        by: ['toProfileId'],
        where: { createdAt: { gt: new Date(now.getTime() - WEEK) } },
        _count: { _all: true },
      }),
    ]);
    let candidates = fresh;
    if (!candidates.length) {
      // With few sharks, all of them may have had a turn lately: then a
      // shorter wait, half as many weeks as there are sharks, so the same
      // one isn't picked twice in a row
      const all = await drawable(0);
      const weeks = Math.floor(all.length / 2);
      candidates = weeks ? await drawable(weeks * WEEK) : all;
    }
    if (!candidates.length) return null;

    const hearts = new Map(
      recent.map((heart) => [heart.toProfileId, heart._count._all])
    );
    const weights = candidates.map((shark) =>
      weight(shark, hearts.get(shark.id) ?? 0, now)
    );
    // A whole number from 0 up to the total weight, landing on each shark as often as its weight
    let ticket = randomInt(weights.reduce((sum, w) => sum + w, 0));
    const index = weights.findIndex((w) => (ticket -= w) < 0);

    return tx.sharkOfTheWeek.create({
      data: { week, profileId: candidates[index].id },
      select: { profileId: true },
    });
  });

  if (picked) await emailOwner(picked.profileId);
}

/** Tells the owner, unless they turned these off. A failed send is only logged: the pick stands. */
async function emailOwner(profileId: string) {
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
            featuredEmails: true,
            banned: true,
            banExpires: true,
          },
        },
      },
    });
    const owner = shark?.user;
    if (!shark || !owner?.featuredEmails || !owner.emailVerified) return;
    if (isBanned(owner)) return;
    await sendSharkOfTheWeekEmail({
      email: owner.email,
      username: owner.username,
      shark: shark.displayName,
      url: new URL(sharkPath(shark), siteURL).href,
      unsubscribe: unsubscribeUrls(owner.id, 'featured'),
    });
  } catch (error) {
    console.error(`Failed to email the owner of ${profileId}`, error);
  }
}

/** The week's pick, as moderators see it: skipped ones left out. */
export async function currentPick(now = new Date()) {
  return prisma.sharkOfTheWeek.findFirst({
    where: { week: isoWeek(now), skipped: false },
    select: {
      id: true,
      profile: {
        select: {
          id: true,
          displayName: true,
          user: { select: { username: true } },
        },
      },
    },
  });
}

/**
 * Skips the week's pick, which draws another (one that wasn't skipped this
 * week). Its owner already had the email; the next one gets one too.
 */
export async function skipSharkOfTheWeek(pickId: string) {
  const { count } = await prisma.sharkOfTheWeek.updateMany({
    where: { id: pickId, skipped: false },
    data: { skipped: true },
  });
  if (count) await pickSharkOfTheWeek();
  return count > 0;
}

/**
 * The Shark of the Week for the home page, while it's still live. Cached for
 * an hour, so a new pick (or a skip) shows within one.
 */
export async function getSharkOfTheWeek() {
  'use cache: remote';
  cacheLife('hours');
  cacheTag(SHARK_OF_THE_WEEK_TAG);

  const pick = await prisma.sharkOfTheWeek.findFirst({
    where: {
      week: isoWeek(new Date()),
      skipped: false,
      profile: { status: ProfileStatus.VERIFIED, user: notBannedWhere() },
    },
    select: { profile: { select: PUBLIC_PROFILE } },
  });
  return pick?.profile ?? null;
}

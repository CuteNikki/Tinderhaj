import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';

import { Prisma, ProfileStatus } from '@/generated/client';

import { notBannedWhere } from '@/lib/bans';
import prisma from '@/lib/prisma';
import { PROFILE_COUNT_TAG, PUBLIC_PROFILE } from '@/lib/queries';

/** The day Tinderhaj began. */
export const STARTED = new Date(Date.UTC(2024, 11, 21));

const INCH = 2.54;

/** The sharks discovery shows, for the counts in SQL: verified, of accounts that aren't banned (as notBannedWhere). */
const LIVE_IDS = Prisma.sql`
  SELECT p."id" FROM "Profile" p JOIN "User" u ON u."id" = p."userId"
  WHERE p."status" = 'VERIFIED'
    AND (NOT u."banned" OR u."banExpires" <= now())`;

/**
 * Tinderhaj in numbers, for its birthday page: everything since it began,
 * counting only what discovery shows (verified sharks of accounts that
 * aren't banned). Cached for an hour, like the home page's count.
 */
export async function getBirthdayStats() {
  'use cache: remote';
  cacheLife('hours');
  cacheTag(PROFILE_COUNT_TAG);

  const live = { status: ProfileStatus.VERIFIED, user: notBannedWhere() };

  const [
    sharks,
    owners,
    hearts,
    matches,
    sized,
    places,
    months,
    interests,
    first,
  ] = await Promise.all([
    prisma.profile.count({ where: live }),
    prisma.user.count({
      where: {
        ...notBannedWhere(),
        profiles: { some: { status: ProfileStatus.VERIFIED } },
      },
    }),
    prisma.heart.count({ where: { from: live, to: live } }),
    // Each match once: two hearts, one each way
    prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) AS count FROM "Heart" a
        JOIN "Heart" b ON b."fromProfileId" = a."toProfileId" AND b."toProfileId" = a."fromProfileId"
        WHERE a."fromProfileId" < a."toProfileId"
          AND a."fromProfileId" IN (${LIVE_IDS}) AND a."toProfileId" IN (${LIVE_IDS})`,
    prisma.profile.findMany({
      where: { ...live, size: { not: null } },
      select: { size: true, unit: true },
    }),
    prisma.profile.findMany({
      where: { ...live, location: { not: null } },
      select: { location: true },
    }),
    // The month most sharks were first verified in
    prisma.$queryRaw<{ month: Date; count: bigint }[]>`
        SELECT date_trunc('month', "verifiedAt") AS month, COUNT(*) AS count
        FROM "Profile" WHERE "id" IN (${LIVE_IDS}) AND "verifiedAt" IS NOT NULL
        GROUP BY 1 ORDER BY 2 DESC, 1 ASC LIMIT 1`,
    // Interests, the same however they're written
    prisma.$queryRaw<{ interest: string; count: bigint }[]>`
        SELECT MIN(interest) AS interest, COUNT(*) AS count
        FROM "Profile", unnest("interests") AS interest
        WHERE "id" IN (${LIVE_IDS})
        GROUP BY lower(trim(interest)) ORDER BY 2 DESC, 1 ASC LIMIT 8`,
    prisma.profile.findFirst({
      where: { ...live, verifiedAt: { not: null } },
      select: PUBLIC_PROFILE,
      orderBy: { verifiedAt: 'asc' },
    }),
  ]);

  const sizes = sized.map((shark) =>
    shark.unit === 'INCH' ? shark.size! * INCH : shark.size!
  );

  return {
    /** How many years old it is today */
    years: yearsSinceStart(),
    sharks,
    owners,
    hearts,
    matches: Number(matches[0].count),
    averageSize: sizes.length
      ? Math.round(sizes.reduce((sum, size) => sum + size, 0) / sizes.length)
      : null,
    places: new Set(places.map((shark) => shark.location!.trim().toLowerCase()))
      .size,
    busiestMonth: months[0]
      ? { month: months[0].month, count: Number(months[0].count) }
      : null,
    interests: interests.map(({ interest, count }) => ({
      interest,
      count: Number(count),
    })),
    first,
  };
}

/** How many whole years Tinderhaj has been around on `now`. */
export function yearsSinceStart(now = new Date()) {
  let years = now.getUTCFullYear() - STARTED.getUTCFullYear();
  const before =
    now.getUTCMonth() < STARTED.getUTCMonth() ||
    (now.getUTCMonth() === STARTED.getUTCMonth() &&
      now.getUTCDate() < STARTED.getUTCDate());
  if (before) years--;
  return years;
}

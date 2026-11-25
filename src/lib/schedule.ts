import 'server-only';

import { Prisma, ProfileStatus } from '@/generated/client';

import { isBanned, notBannedWhere } from '@/lib/bans';
import { sendSharkBirthdayEmail, sendWeeklyHeartsEmail } from '@/lib/email';
import prisma from '@/lib/prisma';
import { siteURL } from '@/lib/site-url';
import { unsubscribeUrls } from '@/lib/unsubscribe';
import { sharkPath } from '@/lib/utils';

/** Sharks others can see, as in discovery (as liveProfileWhere, which brings the session along). */
const live = () =>
  ({
    status: ProfileStatus.VERIFIED,
    user: notBannedWhere(),
  }) satisfies Prisma.ProfileWhereInput;

/** How often the schedule looks for emails to send. */
const EVERY = 60 * 60 * 1000;
/** From when in the day (UTC) birthdays go out, so not in the night. */
const BIRTHDAY_HOUR = 8;
/** When on Mondays (UTC) the week's hearts go out. */
const HEARTS_HOUR = 9;
const WEEK = 7 * 24 * 60 * 60 * 1000;

/**
 * Notes an email as sent before it goes, so it goes once: false if it
 * already was, by this server or another.
 */
async function claim(kind: string, key: string) {
  const { count } = await prisma.sentEmail.createMany({
    data: { kind, key },
    skipDuplicates: true,
  });
  return count > 0;
}

/** Someone who can be emailed: a confirmed address, and not banned. */
const OWNER = {
  id: true,
  username: true,
  email: true,
  emailVerified: true,
  banned: true,
  banExpires: true,
} satisfies Prisma.UserSelect;

/**
 * Birthday emails for live sharks born on today's date, from BIRTHDAY_HOUR.
 * In a year without a 29th of February, those born then get theirs on the
 * 28th.
 */
async function sendBirthdays(now: Date) {
  if (now.getUTCHours() < BIRTHDAY_HOUR) return;
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const leap = new Date(Date.UTC(year, 1, 29)).getUTCMonth() === 1;
  const alsoLeapDay = !leap && month === 2 && day === 28;

  const born = await prisma.$queryRaw<{ id: string }[]>`
    SELECT "id" FROM "Profile"
    WHERE "status" = 'VERIFIED' AND "birthday" IS NOT NULL
      AND EXTRACT(MONTH FROM "birthday") = ${month}
      AND (EXTRACT(DAY FROM "birthday") = ${day}
        OR (${alsoLeapDay} AND EXTRACT(MONTH FROM "birthday") = 2 AND EXTRACT(DAY FROM "birthday") = 29))`;
  if (!born.length) return;

  const sharks = await prisma.profile.findMany({
    where: {
      id: { in: born.map((shark) => shark.id) },
      status: ProfileStatus.VERIFIED,
      user: { ...notBannedWhere(), birthdayEmails: true, emailVerified: true },
    },
    select: {
      id: true,
      displayName: true,
      birthday: true,
      user: { select: OWNER },
    },
  });

  for (const shark of sharks) {
    const age = year - shark.birthday!.getUTCFullYear();
    if (age < 1 || isBanned(shark.user)) continue;
    if (!(await claim('birthday', `${shark.id}:${year}`))) continue;
    try {
      await sendSharkBirthdayEmail({
        email: shark.user.email,
        username: shark.user.username,
        shark: shark.displayName,
        age,
        url: new URL(sharkPath(shark), siteURL).href,
        unsubscribe: unsubscribeUrls(shark.user.id, 'birthdays'),
      });
    } catch (error) {
      console.error(`Failed to send ${shark.id}'s birthday email`, error);
    }
  }
}

/** The ISO week a day is in, as "2026-W48": the key for a week's email. */
export function isoWeek(date: Date) {
  const day = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  // The week's Thursday decides its year
  day.setUTCDate(day.getUTCDate() + 3 - ((day.getUTCDay() + 6) % 7));
  const firstThursday = new Date(Date.UTC(day.getUTCFullYear(), 0, 4));
  const week =
    1 +
    Math.round(
      ((day.getTime() - firstThursday.getTime()) / 86_400_000 -
        3 +
        ((firstThursday.getUTCDay() + 6) % 7)) /
        7
    );
  return `${day.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/**
 * On Mondays from HEARTS_HOUR: to each owner, the hearts their sharks got in
 * the past week from others' live sharks that they haven't seen yet. Nothing
 * for a week without any.
 */
async function sendWeeklyHearts(now: Date) {
  if (now.getUTCDay() !== 1 || now.getUTCHours() < HEARTS_HOUR) return;

  const hearts = await prisma.heart.findMany({
    where: {
      seenAt: null,
      createdAt: { gte: new Date(now.getTime() - WEEK) },
      from: live(),
      to: {
        status: ProfileStatus.VERIFIED,
        user: { ...notBannedWhere(), heartsEmails: true, emailVerified: true },
      },
    },
    select: { fromProfileId: true, toProfileId: true },
  });
  if (!hearts.length) return;
  // Hearted back already: a match, which has an email of its own
  const back = new Set(
    (
      await prisma.heart.findMany({
        where: {
          OR: hearts.map((heart) => ({
            fromProfileId: heart.toProfileId,
            toProfileId: heart.fromProfileId,
          })),
        },
        select: { fromProfileId: true, toProfileId: true },
      })
    ).map((heart) => `${heart.toProfileId}:${heart.fromProfileId}`)
  );
  const counts = new Map<string, number>();
  for (const heart of hearts) {
    if (back.has(`${heart.fromProfileId}:${heart.toProfileId}`)) continue;
    counts.set(heart.toProfileId, (counts.get(heart.toProfileId) ?? 0) + 1);
  }
  if (!counts.size) return;

  const sharks = await prisma.profile.findMany({
    where: { id: { in: [...counts.keys()] } },
    select: { id: true, displayName: true, user: { select: OWNER } },
  });

  // Shark by shark, under each owner
  const owners = new Map<
    string,
    {
      user: (typeof sharks)[number]['user'];
      sharks: { name: string; hearts: number }[];
    }
  >();
  for (const shark of sharks) {
    const owner = owners.get(shark.user.id) ?? { user: shark.user, sharks: [] };
    owner.sharks.push({
      name: shark.displayName,
      hearts: counts.get(shark.id) ?? 0,
    });
    owners.set(shark.user.id, owner);
  }

  const week = isoWeek(now);
  for (const { user, sharks: theirs } of owners.values()) {
    if (isBanned(user)) continue;
    if (!(await claim('hearts', `${user.id}:${week}`))) continue;
    try {
      await sendWeeklyHeartsEmail({
        email: user.email,
        username: user.username,
        sharks: theirs.sort((a, b) => b.hearts - a.hearts),
        url: new URL('/dashboard/hearts?tab=received', siteURL).href,
        unsubscribe: unsubscribeUrls(user.id, 'hearts'),
      });
    } catch (error) {
      console.error(`Failed to send ${user.id}'s weekly hearts email`, error);
    }
  }
}

/** Everything the schedule sends, as of `now`. Each part on its own, so one failing doesn't stop the other. */
export async function runSchedule(now = new Date()) {
  for (const [name, job] of [
    ['birthdays', sendBirthdays],
    ['weekly hearts', sendWeeklyHearts],
  ] as const) {
    try {
      await job(now);
    } catch (error) {
      console.error(`The ${name} schedule failed`, error);
    }
  }
}

// One timer for the process, kept across development's hot reloads
const kept = globalThis as typeof globalThis & { schedule?: NodeJS.Timeout };

/**
 * Starts the schedule: now, and then every hour, for as long as the server
 * runs. Only where emails can be sent.
 */
export function startSchedule() {
  if (kept.schedule || !process.env.SMTP_URL) return;
  kept.schedule = setInterval(() => void runSchedule(), EVERY);
  void runSchedule();
}

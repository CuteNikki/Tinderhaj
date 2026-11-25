import 'server-only';

import { cacheLife } from 'next/cache';

import {
  birthdayNumber,
  isBirthdayWeek,
  isSnowSeason,
} from '@/constants/seasons';

/**
 * The season as of now, for what the site wears. Cached for an hour, so
 * prerendered pages pick it up within one of it changing. SEASON_DATE (e.g.
 * 2026-12-24) pretends it's another day, to try a season out.
 */
export async function currentSeason() {
  'use cache';
  cacheLife('hours');

  const now = process.env.SEASON_DATE
    ? new Date(process.env.SEASON_DATE)
    : new Date();
  return {
    snow: isSnowSeason(now),
    birthday: isBirthdayWeek(now) ? birthdayNumber(now) : null,
  };
}

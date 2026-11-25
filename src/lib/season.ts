import 'server-only';

import { cacheLife } from 'next/cache';

import { seasonOn } from '@/constants/seasons';

/**
 * What the site wears as of now (see seasonOn). Cached for an hour, so
 * prerendered pages pick a new season up within one of it starting.
 * SEASON_DATE (e.g. 2026-12-24) pretends it's another day, to try one out.
 */
export async function currentSeason() {
  'use cache';
  cacheLife('hours');

  return seasonOn(
    process.env.SEASON_DATE ? new Date(process.env.SEASON_DATE) : new Date()
  );
}

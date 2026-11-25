import { currentSeason } from '@/lib/season';

import { Snow } from '@/components/season/snow';

/** What the whole site wears for the season: snow in December. */
export async function Season() {
  const season = await currentSeason();
  return season.snow ? <Snow /> : null;
}

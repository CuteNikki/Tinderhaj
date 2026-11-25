import { currentSeason } from '@/lib/season';

import { SeasonEffects } from '@/components/season/season-effects';

/** What the whole site wears for the season: snow, hearts, bats and the like (see seasonOn). */
export async function Season() {
  const { effect } = await currentSeason();
  return effect ? <SeasonEffects effect={effect} /> : null;
}

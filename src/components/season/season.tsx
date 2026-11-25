import { currentSeason } from '@/lib/season';

import { SeasonEffects } from '@/components/season/season-effects';

/** The season's effect in the home page's water: snow, confetti, bats and ghosts (see seasonOn). */
export async function Season() {
  const { effect } = await currentSeason();
  return effect ? <SeasonEffects effect={effect} /> : null;
}

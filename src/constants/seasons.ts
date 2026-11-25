/**
 * What the site wears on a day: an effect drifting over every page (see
 * SeasonEffects), and the home page's badge for the day's news (see
 * SeasonBadge). Holidays come first, then the seasons; most days have
 * neither. Days are counted in UTC, so it changes at the same moment
 * everywhere.
 */

/** What drifts over the page. */
export type SeasonEffect =
  'snow' | 'confetti' | 'valentines' | 'trans' | 'pride' | 'halloween';

/** What the home page's badge says, beyond what the site is. */
export type SeasonBadgeKind =
  | 'birthday'
  | 'newYear'
  | 'valentines'
  | 'trans'
  | 'pride'
  | 'halloween'
  | 'holidays';

export type Season = {
  effect: SeasonEffect | null;
  badge: SeasonBadgeKind | null;
  /** Which birthday it is, in its week: 2 in 2026 */
  birthday: number | null;
};

/** The day Tinderhaj began, in 2024. */
const BIRTHDAY = { month: 12, day: 21 };
const STARTED = 2024;
/** How many days the birthday is celebrated, from the day itself. */
const BIRTHDAY_DAYS = 7;
const DAY = 24 * 60 * 60 * 1000;

/** What the site wears on `date`. */
export function seasonOn(date: Date): Season {
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const season = (
    effect: SeasonEffect | null,
    badge: SeasonBadgeKind | null
  ): Season => ({ effect, badge, birthday: null });

  const birthdayStart = Date.UTC(year, BIRTHDAY.month - 1, BIRTHDAY.day);
  const time = date.getTime();
  if (time >= birthdayStart && time < birthdayStart + BIRTHDAY_DAYS * DAY)
    return { effect: 'confetti', badge: 'birthday', birthday: year - STARTED };

  if ((month === 12 && day === 31) || (month === 1 && day === 1))
    return season('confetti', 'newYear');
  if (month === 2 && day >= 13 && day <= 15)
    return season('valentines', 'valentines');
  // Trans Day of Visibility
  if (month === 3 && day === 31) return season('trans', 'trans');
  if (month === 6) return season('pride', 'pride');
  if (month === 10) return season('halloween', 'halloween');
  if (month === 12) return season('snow', 'holidays');

  return season(null, null);
}

/**
 * What the site wears on a day: snow in December, and Tinderhaj's birthday
 * week from December 21, the day it began in 2024. Days are counted in UTC,
 * so it changes at the same moment everywhere.
 */

const BIRTHDAY = { month: 12, day: 21 };
/** How many days the birthday is celebrated, from the day itself. */
const BIRTHDAY_DAYS = 7;
const DAY = 24 * 60 * 60 * 1000;

/** Whether it snows on the site: all of December. */
export function isSnowSeason(date: Date) {
  return date.getUTCMonth() + 1 === 12;
}

/** Whether it's Tinderhaj's birthday week. */
export function isBirthdayWeek(date: Date) {
  const start = Date.UTC(
    date.getUTCFullYear(),
    BIRTHDAY.month - 1,
    BIRTHDAY.day
  );
  const time = date.getTime();
  return time >= start && time < start + BIRTHDAY_DAYS * DAY;
}

/** Which birthday it is in a year: 2 in 2026. */
export function birthdayNumber(date: Date) {
  return date.getUTCFullYear() - 2024;
}

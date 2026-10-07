// Shared by the ban form and the server, so keep this free of server-only imports.

/** The longest reason a moderator can give. */
export const BAN_REASON_MAX = 500;

/** How long a ban can last, by days. 'permanent' lasts until it's lifted. */
export const BAN_DURATIONS = {
  '1': '1 day',
  '3': '3 days',
  '7': '1 week',
  '30': '1 month',
  permanent: 'Until lifted',
} as const;

export type BanDuration = keyof typeof BAN_DURATIONS;

export function isBanDuration(value: unknown): value is BanDuration {
  return typeof value === 'string' && Object.hasOwn(BAN_DURATIONS, value);
}

/** When a ban of `duration` given now ends; null for one until it's lifted. */
export function banExpiry(duration: BanDuration) {
  return duration === 'permanent' ? null : new Date(Date.now() + Number(duration) * 24 * 60 * 60 * 1000);
}

/**
 * Whether a ban is in force. An expired ban is only cleared at their next
 * sign-in, so the flag alone can be out of date.
 */
export function isBanned(user: { banned: boolean; banExpires: Date | null }, now = new Date()) {
  return user.banned && (!user.banExpires || user.banExpires > now);
}

/** For queries: accounts that aren't banned right now. */
export function notBannedWhere() {
  return { OR: [{ banned: false }, { banExpires: { lte: new Date() } }] };
}

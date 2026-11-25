/** The cookie an invite link leaves, holding who invited them, until they sign up. */
export const INVITE_COOKIE = 'tinderhaj.invite';
/** How long an invite link counts after it's opened: 30 days, in seconds. */
export const INVITE_MAX_AGE = 30 * 24 * 60 * 60;

/**
 * Badges for bringing friends: each friend counts once they have a verified
 * shark. A group of sharks is a shiver.
 */
export const INVITE_BADGES = [
  {
    key: 'wingfin',
    label: 'Wingfin',
    count: 1,
    about: 'Brought a friend and their shark',
  },
  {
    key: 'pod-builder',
    label: 'Pod Builder',
    count: 3,
    about: 'Brought 3 friends and their sharks',
  },
  {
    key: 'shiver-captain',
    label: 'Shiver Captain',
    count: 10,
    about: 'Brought 10 friends and their sharks',
  },
] as const;

export type InviteBadge = (typeof INVITE_BADGES)[number];

/** The badges `count` friends earn, smallest first. */
export function inviteBadges(count: number): InviteBadge[] {
  return INVITE_BADGES.filter((badge) => count >= badge.count);
}

/** The path of someone's invite link. */
export function invitePath(username: string) {
  return `/join/${encodeURIComponent(username)}`;
}

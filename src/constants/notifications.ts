/**
 * The emails people can turn off, each with its setting on the account: in
 * Settings > Notifications, and from each email's unsubscribe link.
 */
export const NOTIFICATIONS = {
  verified: {
    field: 'verifiedEmails',
    label: 'Email me when one of my sharks is verified',
    about: 'when one of your sharks is verified',
  },
  matches: {
    field: 'matchEmails',
    label: 'Email me when one of my sharks gets a match',
    about: 'when one of your sharks gets a match',
  },
  hearts: {
    field: 'heartsEmails',
    label: 'Email me on Mondays about new hearts my sharks got',
    about: 'about new hearts on Mondays',
  },
  featured: {
    field: 'featuredEmails',
    label: 'Email me when one of my sharks is Shark of the Week',
    about: 'when one of your sharks is Shark of the Week',
  },
  birthdays: {
    field: 'birthdayEmails',
    label: "Email me on my sharks' birthdays",
    about: "on your sharks' birthdays",
  },
  invites: {
    field: 'inviteEmails',
    label: 'Email me when a friend I invited gets a shark verified',
    about: 'when a friend you invited gets a shark verified',
  },
} as const;

export type NotificationKind = keyof typeof NOTIFICATIONS;

export function isNotificationKind(kind: unknown): kind is NotificationKind {
  return typeof kind === 'string' && Object.hasOwn(NOTIFICATIONS, kind);
}

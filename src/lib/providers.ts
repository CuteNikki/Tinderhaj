/**
 * Every social provider Tinderhaj can offer, in the order the buttons show.
 * Each one only turns on when its client id and secret are set, as
 * `<ID>_CLIENT_ID` and `<ID>_CLIENT_SECRET` (see lib/auth.ts).
 */
export const SOCIAL_PROVIDERS = [
  { id: 'google', label: 'Google' },
  { id: 'apple', label: 'Apple' },
  { id: 'microsoft', label: 'Microsoft' },
  { id: 'github', label: 'GitHub' },
  { id: 'discord', label: 'Discord' },
  { id: 'twitter', label: 'X' },
  { id: 'twitch', label: 'Twitch' },
  { id: 'facebook', label: 'Facebook' },
] as const;

export type SocialProviderId = (typeof SOCIAL_PROVIDERS)[number]['id'];

export function providerLabel(id: string) {
  return SOCIAL_PROVIDERS.find((provider) => provider.id === id)?.label ?? id;
}

/** Why signing in with a provider didn't work, from Better Auth's ?error=. */
export function socialErrorMessage(error: string) {
  switch (error) {
    case 'account_not_linked':
      return 'An account with this email already exists. Sign in with your password or a passkey, then connect it in your account settings.';
    case 'email_not_found':
      return 'That account didn’t share an email address, which Tinderhaj needs.';
    case 'access_denied':
      return 'Signing in was cancelled.';
    default:
      return 'That didn’t work. Please try again.';
  }
}

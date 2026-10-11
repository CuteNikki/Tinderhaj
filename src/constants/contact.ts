export const CONTACT_EMAIL = 'contact@tinderhaj.com';

export type SocialId = 'discord' | 'x' | 'instagram' | 'github';

/**
 * Where to find Tinderhaj, on the contact page. `href` is where its short link
 * goes (see socialLink), and pages link to that rather than here. One without
 * an `href` yet isn't shown, so it can wait here until there's a link for it.
 */
export const SOCIALS: { id: SocialId; name: string; handle: string | null; href: string | null; blurb: string }[] = [
  { id: 'discord', name: 'Discord', handle: 'tinderhaj.com/discord', href: 'https://discord.gg/m6yVUqNqt', blurb: 'Hang out with the rest of the pod.' },
  { id: 'x', name: 'Twitter', handle: '@tinderhaj', href: 'https://x.com/tinderhaj', blurb: 'News, updates, and the odd shark pun.' },
  { id: 'instagram', name: 'Instagram', handle: '@tinderhaj', href: 'https://www.instagram.com/tinderhaj', blurb: 'Sharks living their best lives.' },
  {
    id: 'github',
    name: 'GitHub',
    handle: 'CuteNikki/tinderhaj',
    href: 'https://github.com/CuteNikki/tinderhaj',
    blurb: 'The code behind it all. Found a bug? Tell us here.',
  },
];

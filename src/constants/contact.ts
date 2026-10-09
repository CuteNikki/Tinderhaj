export const CONTACT_EMAIL = 'contact@tinderhaj.com';

export const GITHUB_URL = 'https://github.com/CuteNikki/tinderhaj';
export const DISCORD_URL = 'https://discord.gg/tinderhaj';

export type SocialId = 'discord' | 'x' | 'instagram' | 'github';

/**
 * Where to find Tinderhaj, on the contact page. One without an `href` yet
 * isn't shown, so it can wait here until there's a link for it.
 */
export const SOCIALS: { id: SocialId; name: string; handle: string | null; href: string | null; blurb: string }[] = [
  { id: 'discord', name: 'Discord', handle: 'discord.gg/tinderhaj', href: DISCORD_URL, blurb: 'Hang out with the rest of the pod.' },
  { id: 'x', name: 'Twitter', handle: '@tinderhaj', href: 'https://x.com/tinderhaj', blurb: 'News, updates, and the odd shark pun.' },
  { id: 'instagram', name: 'Instagram', handle: '@tinderhaj', href: 'https://www.instagram.com/tinderhaj', blurb: 'Sharks living their best lives.' },
  { id: 'github', name: 'GitHub', handle: 'CuteNikki/tinderhaj', href: GITHUB_URL, blurb: 'The code behind it all. Found a bug? Tell us here.' },
];

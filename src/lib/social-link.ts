import { SOCIALS, type SocialId } from '@/constants/contact';

/**
 * Tinderhaj's short link to one of its socials, like /discord, which redirects
 * there (see next.config.ts). Links on the site go through these, so each
 * social's own address lives in SOCIALS alone. `path` goes along, e.g.
 * '/issues' for GitHub's. Relative, so it works on whichever server it's on.
 */
export function socialLink(id: SocialId, path = '') {
  return `/${id}${path}`;
}

/**
 * Whether a link leaves the site, so it opens in a new tab: a full address, or
 * a short link to a social, which only looks like one of the site's pages.
 */
export function isExternalLink(href: string) {
  return href.startsWith('http') || SOCIALS.some(({ id }) => href === `/${id}` || href.startsWith(`/${id}/`));
}

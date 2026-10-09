import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/constants/metadata';

/**
 * The pages anyone can read. User pages are left out: they're public, but
 * search engines find them through discovery rather than from a list of every
 * account.
 */
const PAGES = ['/', '/discovery', '/features', '/guide', '/guidelines', '/community', '/about', '/contact', '/privacy', '/terms', '/imprint'];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({ url: new URL(path, SITE_URL).href }));
}

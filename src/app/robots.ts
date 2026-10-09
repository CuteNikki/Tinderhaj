import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/constants/metadata';

/**
 * Keeps crawlers out of the pages that are unlisted in their metadata (only
 * their account, or moderators, can see them) and out of the API.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard', '/moderation', '/reset-password', '/two-factor', '/verified', '/banned'],
    },
    sitemap: new URL('/sitemap.xml', SITE_URL).href,
  };
}

import type { NextConfig } from 'next';

import { SOCIALS, type SocialId } from './src/constants/contact';

/** Short links for a social other than its id. */
const SOCIAL_ALIASES: Partial<Record<SocialId, string[]>> = { x: ['x', 'twitter'] };

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Links prefetch each route's shared shell, and what depends on the URL streams in behind its loading.tsx. The next
  // major turns this on for everyone and removes the option.
  partialPrefetching: true,
  reactCompiler: true,

  async redirects() {
    return [
      // The sections themselves open on their first page, for now.
      { source: '/dashboard', destination: '/dashboard/profiles', permanent: false },
      { source: '/moderation', destination: '/moderation/verification', permanent: false },
      // Short links to Tinderhaj elsewhere, like tinderhaj.com/discord. Not permanent, so a new invite or handle
      // takes over right away instead of browsers keeping the old one.
      // Anything after it goes along, like /github/issues.
      ...SOCIALS.flatMap(({ id, href }) =>
        href
          ? (SOCIAL_ALIASES[id] ?? [id]).flatMap((slug) => [
              { source: `/${slug}`, destination: href, permanent: false },
              { source: `/${slug}/:path+`, destination: `${href}/:path+`, permanent: false },
            ])
          : [],
      ),
    ];
  },

  images: {
    remotePatterns: [
      {
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;

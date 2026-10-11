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
  // Nobody needs to know what it's built with
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Never inside another site's frame, where it could be dressed up to trick a click (deleting an account,
          // banning someone). Both: the CSP for browsers now, the other for old ones.
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
          { key: 'X-Frame-Options', value: 'DENY' },
          // Files are what they say they are, not whatever the browser guesses from their contents
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Other sites learn where a visitor came from, not the page: links like reset-password carry tokens
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

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

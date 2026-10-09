import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Links prefetch as they did before Next 16.4, which is what leaving this out did too. Turning it on is a migration of
  // its own (node_modules/next/dist/docs/01-app/02-guides/adopting-partial-prefetching.md); the next major turns it on anyway.
  partialPrefetching: false,
  reactCompiler: true,

  async redirects() {
    return [
      // The sections themselves open on their first page, for now.
      { source: '/dashboard', destination: '/dashboard/profiles', permanent: false },
      { source: '/moderation', destination: '/moderation/verification', permanent: false },
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

import type { NextConfig } from 'next';

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

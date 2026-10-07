import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
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

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;

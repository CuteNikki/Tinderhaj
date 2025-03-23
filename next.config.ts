import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;

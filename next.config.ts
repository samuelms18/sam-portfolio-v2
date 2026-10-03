import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Images uploaded in the Sanity dashboard
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
};

export default nextConfig;

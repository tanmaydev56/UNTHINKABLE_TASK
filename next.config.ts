// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 1. Skip TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  },

  // 2. Skip ESLint errors
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
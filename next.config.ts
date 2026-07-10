import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: '.next',
  images: {
    domains: ['firebasestorage.googleapis.com', 'picsum.photos'],
  },
  turbopack: {
    resolveAlias: {
      '@': '.',
    },
  },
};

export default nextConfig;

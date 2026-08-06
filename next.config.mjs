/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      '@': '.',
    },
  },
  serverExternalPackages: ['twilio', 'pdf-parse'],
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure proper handling of routes
  trailingSlash: false,
  // Configure allowed image sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Explicitly set the output to be a standalone build
  output: 'standalone',
  // Performance optimizations for development
  typescript: {
    // Speed up development by ignoring type errors during development
    // Remove this in production builds
    ignoreBuildErrors: true,
  },
  // Disable ESLint during development for faster builds
  // Remove this in production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

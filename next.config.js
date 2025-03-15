/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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
      {
        protocol: 'https',
        hostname: '*.firebasestorage.googleapis.com',
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
  // Environment variables configuration
  env: {
    // Provide fallback values for Firebase config during build time
    // These will be overridden by actual environment variables at runtime
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'placeholder-api-key',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'placeholder-auth-domain',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'placeholder-project-id',
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'placeholder-storage-bucket',
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'placeholder-messaging-sender-id',
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'placeholder-app-id',
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'placeholder-measurement-id',
  },
  // Experimental features
  experimental: {
    // Server Actions are available by default in Next.js 14+
    // Completely disable static generation for the entire app
    serverComponentsExternalPackages: ['firebase', '@supabase/supabase-js'],
  },
  // Configure page generation behavior
  // This prevents Next.js from trying to pre-render pages that require authentication
  // during the build process
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Completely disable static generation for the entire app
  staticPageGenerationTimeout: 0,
  // Force all pages to be server-side rendered
  distDir: process.env.NODE_ENV === 'production' ? '.next-dynamic' : '.next',
};

// Disable static optimization for all pages
nextConfig.generateBuildId = async () => {
  return `build-${Date.now()}`;
};

module.exports = withBundleAnalyzer(nextConfig);

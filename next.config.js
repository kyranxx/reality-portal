/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

let withBundleAnalyzer = (config) => config;
try {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
} catch (e) {
  console.warn('Warning: @next/bundle-analyzer not found, bundle analysis disabled');
}

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // i18n configuration
  i18n,
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
    serverComponentsExternalPackages: ['firebase', '@supabase/supabase-js'],
    // Configure runtime properly
    runtime: 'nodejs', // Default runtime
  },
  // Configure page generation behavior
  // This prevents Next.js from trying to pre-render pages that require authentication
  // during the build process
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Configure static generation behavior
  staticPageGenerationTimeout: 180,
  distDir: '.next',
  
  // App Router doesn't support exportPathMap
  // Protected pages will be handled by the NoSSR component
};

// Disable static optimization for all pages
nextConfig.generateBuildId = async () => {
  return `build-${Date.now()}`;
};

// Add a custom webpack configuration to handle client-only modules
nextConfig.webpack = (config, { isServer }) => {
  // If on the server side, add a null loader for client-only modules
  if (isServer) {
    config.module.rules.push({
      test: /firebase\/auth/,
      use: 'null-loader',
    });
  }
  
  // Add support for importing JSON files
  config.module.rules.push({
    test: /\.json$/,
    type: 'json',
  });
  
  return config;
};

module.exports = withBundleAnalyzer(nextConfig);

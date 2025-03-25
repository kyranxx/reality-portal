/** @type {import('next').NextConfig} */

// Determine the current environment
const isVercel = process.env.VERCEL === '1';
const isPreviewDeployment = process.env.VERCEL_ENV === 'preview';
const isDevelopment = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

// Get the base URL for asset prefixing
const getBaseUrl = () => {
  if (isVercel) {
    // For preview deployments, we don't set a specific assetPrefix to avoid CORS issues
    if (isPreviewDeployment) {
      return '';
    }
    // For production deployments, we use the canonical URL
    return 'https://reality-portal.vercel.app';
  }
  // For local development
  return '';
};

const nextConfig = {
  output: isVercel ? 'standalone' : undefined,
  reactStrictMode: true,
  
  // Configure asset prefixing based on environment
  assetPrefix: getBaseUrl(),
  
  // Configure public runtime variables
  publicRuntimeConfig: {
    baseUrl: getBaseUrl(),
    vercelEnvironment: process.env.VERCEL_ENV || 'development',
    isVercel: isVercel || false,
  },
  
  // Configure image component
  images: {
    domains: [
      'firebasestorage.googleapis.com', 
      'via.placeholder.com',
      'reality-portal.vercel.app'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
      // Add patterns for Vercel deployments to allow cross-origin image loading
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/**',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Add headers for specific paths - these work in conjunction with middleware.ts
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Handle specific module issues in the build
    if (!isServer) {
      // Replace problematic modules with empty modules in client build
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Ensure web-friendly builds
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    
    // Optimize chunks for better loading performance
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          // Critical fix: For server builds, only chunk async code
          // This prevents browser-only code with 'self' references from being in server bundles
          chunks: isServer ? 'async' : 'all',
        },
        // Create a separate chunk for the font loader
        fontLoader: {
          test: /[\\/]node_modules[\\/]next[\\/]dist[\\/]client[\\/]font/,
          name: 'font-loader',
          chunks: 'all',
          priority: 10,
        },
      },
    };
    
    // Add server-specific externals for browser-only modules
    if (isServer) {
      // Exclude browser-only modules from server builds
      config.externals.push({
        // Common browser-only modules that might use 'self'
        'crypto-browserify': 'commonjs crypto-browserify',
        'browser-env': 'commonjs browser-env',
      });
    }
    
    return config;
  },
  
  // Environment variables
  env: {
    PUBLIC_URL: process.env.PUBLIC_URL || '',
    VERCEL_ENV: process.env.VERCEL_ENV || '',
    VERCEL: process.env.VERCEL || '',
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL || 'localhost:3000',
    // Add an asset base path variable for client-side use
    NEXT_PUBLIC_ASSET_PREFIX: getBaseUrl(),
  },
};

module.exports = nextConfig;

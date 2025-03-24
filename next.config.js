/** @type {import('next').NextConfig} */

const nextConfig = {
  output: process.env.VERCEL === '1' ? 'standalone' : undefined,
  reactStrictMode: true,
  experimental: {
    // The appDir flag is no longer needed in Next.js 14+
    // The staticAppRouterPages option is also deprecated
  },
  images: {
    domains: ['firebasestorage.googleapis.com', 'via.placeholder.com'],
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
      }
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
    
    return config;
  },
  // Handle environment-specific settings
  env: {
    PUBLIC_URL: process.env.PUBLIC_URL || '',
    VERCEL_ENV: process.env.VERCEL_ENV || '',
    VERCEL: process.env.VERCEL || '',
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL || 'localhost:3000',
  },
  // Add specific configuration for Vercel deployment
  ...(process.env.VERCEL === '1' ? {
    assetPrefix: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    basePath: '',
  } : {}),
};

module.exports = nextConfig;

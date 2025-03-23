/** @type {import('next').NextConfig} */

const nextConfig = {
  output: process.env.VERCEL === '1' ? 'standalone' : undefined,
  reactStrictMode: true,
  experimental: {
    // This flag ensures error pages work correctly with the app router
    appDir: true,
    // Disables static rendering of app directory pages because they use dynamic client components
    staticAppRouterPages: false,
  },
  images: {
    domains: ['firebasestorage.googleapis.com', 'via.placeholder.com'],
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
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure proper handling of routes
  trailingSlash: false,
};

module.exports = nextConfig;

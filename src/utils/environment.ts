/**
 * Environment detection and URL handling utilities
 *
 * This module provides utilities for detecting the current environment
 * and generating appropriate URLs for assets and API endpoints.
 */

// Environment detection
export const isServer = typeof window === 'undefined';
export const isClient = !isServer;
export const isBuild = process.env.NEXT_PUBLIC_IS_BUILD_TIME === 'true';
export const isVercel = process.env.VERCEL === '1' || process.env.NEXT_PUBLIC_VERCEL === 'true';
export const isPreviewDeployment = process.env.VERCEL_ENV === 'preview';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Current deployment URL detection
export const getDeploymentUrl = (): string => {
  if (isClient) {
    return window.location.origin;
  }

  if (isVercel && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Default for development
  return 'http://localhost:3000';
};

// Base URL for assets based on environment
export const getAssetBaseUrl = (): string => {
  // Use configured asset prefix if available
  if (process.env.NEXT_PUBLIC_ASSET_PREFIX && process.env.NEXT_PUBLIC_ASSET_PREFIX !== '') {
    return process.env.NEXT_PUBLIC_ASSET_PREFIX;
  }

  // For Vercel preview environments, we use relative paths to avoid CORS issues
  if (isVercel && isPreviewDeployment) {
    return '';
  }

  // For production, we use the canonical URL
  if (isVercel && isProduction) {
    return 'https://reality-portal.vercel.app';
  }

  // Default to relative paths for development
  return '';
};

/**
 * Get a URL for an asset with the appropriate base path
 *
 * @param path The relative path to the asset
 * @param forceAbsolute Whether to force an absolute URL
 * @returns The complete URL for the asset
 */
export const getAssetUrl = (path: string, forceAbsolute = false): string => {
  // If the path is already absolute, return it unchanged
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // For absolute URLs
  if (forceAbsolute) {
    return `${getDeploymentUrl()}${normalizedPath}`;
  }

  // For relative URLs with possible asset prefix
  const baseUrl = getAssetBaseUrl();
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
};

/**
 * Get the appropriate URL for a Next.js static asset
 *
 * @param path The relative path to the static asset
 * @returns The complete URL for the static asset
 */
export const getStaticAssetUrl = (path: string): string => {
  // Format: /_next/static/...
  const staticPath = path.startsWith('/') ? path : `/${path}`;
  return getAssetUrl(`/_next/static${staticPath}`);
};

/**
 * Get a public asset URL (from the /public directory)
 *
 * @param path The relative path within the public directory
 * @returns The complete URL for the public asset
 */
export const getPublicAssetUrl = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const assetPath = path.startsWith('/') ? path.substring(1) : path;
  return getAssetUrl(assetPath);
};

/**
 * Get a font asset URL
 *
 * @param fontName The name of the font file
 * @returns The complete URL for the font asset
 */
export const getFontUrl = (fontName: string): string => {
  return getPublicAssetUrl(`fonts/${fontName}`);
};

/**
 * Get an image asset URL
 *
 * @param imageName The name of the image file
 * @returns The complete URL for the image asset
 */
export const getImageUrl = (imageName: string): string => {
  return getPublicAssetUrl(`images/${imageName}`);
};

/**
 * Get environment debug information
 * Returns an object with environment details for debugging
 */
export const getEnvironmentInfo = () => {
  return {
    environment: isDevelopment ? 'development' : isPreviewDeployment ? 'preview' : 'production',
    isVercel,
    isPreviewDeployment,
    deploymentUrl: getDeploymentUrl(),
    assetBaseUrl: getAssetBaseUrl(),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  };
};

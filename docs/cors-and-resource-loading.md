# CORS and Resource Loading Guide

This document explains the strategy implemented for handling Cross-Origin Resource Sharing (CORS) and resource loading in different environments, particularly focusing on Vercel deployments.

## Problem Context

The application was experiencing several issues:

1. **CORS Policy Violations**: Font resources were being blocked due to missing 'Access-Control-Allow-Origin' headers between different Vercel deployment subdomains.

2. **Resource Loading Failures**: Several resources were failing with `net::ERR_FAILED` errors.

3. **Inefficient Preloading**: Resources were being preloaded but not used within the expected timeframe, causing warnings and performance issues.

## Solution Architecture

We've implemented a multi-layered approach to fix these issues permanently:

### 1. CORS Configuration

#### Vercel.json Headers

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, HEAD, POST, OPTIONS" }
      ]
    }
  ]
}
```

#### Middleware-based CORS

The `middleware.ts` file implements dynamic CORS handling that can adapt to different environments:

- Sets appropriate CORS headers for all responses
- Applies stricter headers for static assets
- Handles preflight requests properly
- Special handling for preview deployments

### 2. Asset Loading Strategy

#### Environment-Aware URL Generation

The `environment.ts` utility provides functions to generate correct URLs in any environment:

- `getAssetUrl()`: Generates URLs with the correct base path
- `getPublicAssetUrl()`: For assets in the public directory
- `getFontUrl()`: Specifically for font assets
- `getImageUrl()`: Specifically for image assets

#### Font Loading Strategy

We've implemented a robust font loading approach:

- Self-hosted fonts in `/public/fonts/` directory
- Font loader CSS with proper `font-display: swap` for progressive loading
- Preloading of critical fonts in the layout
- System font fallbacks

### 3. Next.js Configuration

- Asset prefixing based on environment
- Proper image domain configuration for all Vercel environments
- Headers configuration for static assets
- Webpack optimization for font loading

### 4. Validation

We've added validation scripts to prevent deployment of code with CORS issues:

- `scripts/validate-cors.js`: Checks all CORS-related configurations
- Integration into the build process with `npm run validate:cors`

## Implementation Details

### Asset URL Generation

```typescript
// Get a public asset URL (from the /public directory)
export const getPublicAssetUrl = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const assetPath = path.startsWith('/') ? path.substring(1) : path;
  return getAssetUrl(assetPath);
};
```

### Font Loading Strategy

```css
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap; /* Show fallback font until custom font is loaded */
  src:
    local('Inter'),
    url('/fonts/inter-regular.woff2') format('woff2'),
    url('/fonts/inter-regular.woff') format('woff');
}
```

### Environment Detection

```typescript
export const isVercel = process.env.VERCEL === '1' || process.env.NEXT_PUBLIC_VERCEL === 'true';
export const isPreviewDeployment = process.env.VERCEL_ENV === 'preview';
```

## Best Practices

1. **Always use relative paths** when possible to avoid CORS issues
2. **Use environment-aware asset URL generation** for any assets loaded via URLs
3. **Self-host critical fonts** to avoid third-party CORS issues
4. **Implement font-display: swap** to ensure text is visible during font loading
5. **Preload critical resources** but be careful not to preload too many
6. **Set proper cache headers** for static assets
7. **Validate CORS configuration** before deployment
8. **Use middleware for dynamic CORS handling** that adapts to different environments

## Vercel Deployment Considerations

When deploying to Vercel, be aware of these important points:

1. **Preview Deployments**: These have unique URLs and require special CORS handling
2. **Production vs. Preview**: Asset paths may need to be different in different environments
3. **Vercel Edge Network**: Can cache responses, so headers must be correctly set
4. **Custom Domains**: May require additional configuration for CORS

By following this guide and utilizing the implemented strategies, the application should be free from CORS and resource loading issues across all deployment environments.

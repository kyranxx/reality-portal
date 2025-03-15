# Vercel Bundle Analyzer Fix

## Issue

The Vercel deployment was failing with the following error:

```
Error: Cannot find module '@next/bundle-analyzer'
Require stack:
- /vercel/path0/next.config.js
```

This occurred because the `@next/bundle-analyzer` package is listed as a devDependency in package.json, but Vercel's default build process doesn't install devDependencies.

## Solution

Two changes were implemented to fix this issue:

### 1. Updated build-vercel.js to install all dependencies

Added a step to install all dependencies including devDependencies during the Vercel build process:

```javascript
// Ensure all dependencies are installed, including devDependencies
console.log('Ensuring all dependencies are installed...');
execSync('npm install --include=dev', { stdio: 'inherit' });
```

This ensures that `@next/bundle-analyzer` and other devDependencies are available during the build.

### 2. Made next.config.js more robust with conditional bundle-analyzer usage

Modified next.config.js to conditionally use bundle-analyzer only when it's available:

```javascript
let withBundleAnalyzer = config => config;
try {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
} catch (e) {
  console.warn('Warning: @next/bundle-analyzer not found, bundle analysis disabled');
}
```

This provides a fallback in case the package is not available, making the configuration more robust.

## Verification

After implementing these changes, the Vercel build should complete successfully without the "Cannot find module '@next/bundle-analyzer'" error.

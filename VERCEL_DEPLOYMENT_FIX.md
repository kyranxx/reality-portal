# Vercel Deployment Fix

This document explains the changes made to fix the Vercel deployment errors related to authentication.

## The Problem

During the Vercel build process, Next.js attempts to pre-render pages that use the `useAuth` hook, but the authentication context is not available during build time. This causes the following error:

```
Error: useAuth must be used within an AuthProvider
```

This error occurs in the following pages:

- `/dashboard`
- `/admin`
- `/dashboard/profile`

## The Solution

We've implemented several changes to fix this issue:

1. **Created a NoSSR component** (`src/components/NoSSR.tsx`) to prevent server-side rendering of components that use authentication.

2. **Updated client components** to use the NoSSR wrapper:

   - `src/app/dashboard/client.tsx`
   - `src/app/admin/client.tsx`
   - `src/app/dashboard/profile/client.tsx`

3. **Enhanced the FirebaseAuthContext** (`src/utils/FirebaseAuthContext.tsx`) to better handle server-side rendering and build-time rendering.

4. **Added build-time detection** to skip authentication checks during the build process:

   - Added `NEXT_PUBLIC_IS_BUILD_TIME` environment variable
   - Updated the `useAuth` hook to check for this flag

5. **Created a custom build script** (`build-vercel.js`) that handles authentication errors during the build process.

6. **Updated configuration files**:
   - `next.config.js`: Added exportPathMap to skip pre-rendering protected pages
   - `vercel.json`: Updated to use the custom build script
   - `package.json`: Added the custom build script
   - `prebuild.js`: Added build-time flag

## How It Works

1. During the Vercel build process, the `build:vercel` script is executed.
2. The build-time flag is set, which causes the `useAuth` hook to return a default context value.
3. Protected pages are skipped during pre-rendering.
4. Client-side components use the NoSSR wrapper to ensure they're only rendered on the client.

This approach ensures that authentication-protected pages are only rendered on the client side, where the authentication context is available.

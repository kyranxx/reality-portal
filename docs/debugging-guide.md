# Reality Portal Debugging Guide

This guide explains how to use the diagnostic tools we've implemented to identify and fix issues in your web application.

## Quick Start

1. Run the diagnostic tests by opening `http://localhost:3002/debug-test.html` in Chrome
2. Use Chrome DevTools console to run diagnostics on any page with `runDiagnostics()`
3. Execute pre-build validation with `npm run validate`
4. Find SSR issues with `node scripts/diagnose-build-errors.js --run-build`
5. Start development with Firebase emulators using `npm run dev:emulators`

## Debug Tools Overview

### 1. Browser-Based Diagnostics

We've created a comprehensive diagnostic toolkit that can be used in the browser to identify various issues:

- **Run from debug-test.html**: Open `http://localhost:3002/debug-test.html` in your browser to access the diagnostic dashboard
- **Import in your code**: `import { runDiagnostics } from './utils/debug-tools'`
- **Run in console**: Add `<script src="/utils/debug-tools.js"></script>` to your page, then use `runDiagnostics()` in console

The diagnostic tool checks for:

- Global JavaScript errors
- Performance issues (slow loads, long tasks)
- Resource loading problems (CORS, image failures)
- React-specific errors (hydration, boundaries)
- Firebase configuration issues
- Network request problems
- Accessibility concerns
- Browser compatibility issues

### 2. Pre-Deployment Validation

Before deploying, run:

```bash
npm run validate
```

This script checks for:

- Proper client/server component architecture
- Missing 'use client' directives in client components
- Problematic dynamic imports
- Component registry issues
- Backup files that might cause webpack errors

### 3. Build Error Diagnosis

For "self is not defined" and other SSR errors:

```bash
node scripts/diagnose-build-errors.js --run-build
```

This script:

- Sets up diagnostic environment with global.self polyfill
- Analyzes vendor chunks for browser-specific code
- Tracks which modules access problematic globals
- Provides enhanced error reporting

### 4. Firebase Emulators for Local Development

For local development without real Firebase credentials:

```bash
npm run dev:emulators
```

This script:

- Starts Firebase emulators for auth, firestore, and storage
- Launches the Firebase Emulator UI at http://localhost:4000
- Starts the Next.js development server after emulators are ready
- Auto-configures the environment for emulator usage

## Chrome DevTools Techniques

### Console Tab

Use Chrome's console filters to focus on important messages:

- Filter by "Error" or "Warning" level
- Use regex like `/failed|error|warning/i` in the filter box
- Check "Preserve log" to maintain logs during navigation

Execute these diagnostic commands in console:

```javascript
// Run full diagnostics
runDiagnostics();

// Setup monitoring only (without active checks)
initializeMonitoring();

// Check for elements missing alt text
document.querySelectorAll('img:not([alt])');

// Examine memory usage
performance.memory;
```

### Network Tab

- Filter by "Status Code" to find failed requests (e.g., `status-code:404`)
- Sort by "Time" to identify slow resources
- Look for red rows (failed requests)
- Check "Initiator" column to see what triggered each request
- Examine "Response" tab to see error details

### Performance Tab

1. Click "Record" before performing an action
2. Perform the problematic action
3. Click "Stop"
4. Look for:
   - Red frames (long tasks)
   - Yellow triangles (JavaScript warnings)
   - Layout thrashing (alternating layout & script)

### Application Tab

1. Check "Storage" section for quota usage
2. Examine "Service Workers" for registration issues
3. Check "Manifest" for PWA configuration
4. Look at "Frames" for source file details

## Common Issues & Fixes

### Navigation Timeout

**Symptom:** Console error `Navigation timeout of 7000 ms exceeded`

**Possible Causes:**

- Slow server response
- Too many blocking resources
- Long JavaScript execution

**Fixes:**

- Check server response time
- Optimize critical rendering path
- Reduce initial JavaScript payload

### Image Loading Errors

**Symptom:** `⨯ The requested resource isn't a valid image`

**Possible Causes:**

- Incorrect image path
- CORS configuration issues
- Using text files as images

**Fixes:**

- Verify image paths and formats
- Update images.remotePatterns in next.config.js
- Use proper image formats

### CORS Issues

**Symptom:** Cross-Origin Request Blocked errors

**Fixes:**

- Update next.config.js with proper remotePatterns
- Add appropriate CORS headers on the server
- Use relative URLs when possible

### Firebase Configuration

**Symptom:** Firebase initialization errors

**Fixes:**

- Use Firebase emulators for local development: `npm run dev:emulators`
- Set real environment variables in `.env.local` for production
- Ensure auth is initialized before use

## Implementing Monitoring in Production

To add permanent monitoring to your application:

1. Add to your app entry point:

```javascript
import { initializeMonitoring } from './utils/monitoring';

// Initialize early in your app lifecycle
initializeMonitoring();
```

2. For Firebase apps, pass the auth instance:

```javascript
import { initializeMonitoring } from './utils/monitoring';
import { auth } from './utils/firebase';

initializeMonitoring(auth);
```

## Further Reading

- [Next.js Error Handling](https://nextjs.org/docs/advanced-features/error-handling)
- [React Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
- [Firebase Debugging](https://firebase.google.com/docs/auth/web/auth-state-persistence)
- [Chrome DevTools Documentation](https://developers.google.com/web/tools/chrome-devtools)
- [Firebase Emulator Suite Documentation](https://firebase.google.com/docs/emulator-suite)

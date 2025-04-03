/**
 * Fix Debug Tools Redundancy
 * 
 * This script consolidates src/utils/debug-tools.js and public/utils/debug-tools.js
 * by creating a modular debug tools implementation in src/utils/debug/ directory.
 */

const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const srcDebugPath = path.join(rootDir, 'src', 'utils', 'debug-tools.js');
const publicDebugPath = path.join(rootDir, 'public', 'utils', 'debug-tools.js');
const debugDir = path.join(rootDir, 'src', 'utils', 'debug');
const backupDir = path.join(rootDir, 'backups', 'utils');

// Create directories if they don't exist
if (!fs.existsSync(debugDir)) {
  fs.mkdirSync(debugDir, { recursive: true });
}

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

console.log('Debug Tools Consolidation');
console.log('-------------------------');

// Check if debug tools files exist
if (!fs.existsSync(srcDebugPath)) {
  console.error(`❌ Debug tools not found at ${srcDebugPath}`);
  process.exit(1);
}

if (!fs.existsSync(publicDebugPath)) {
  console.error(`❌ Debug tools not found at ${publicDebugPath}`);
  process.exit(1);
}

// Read both debug tools files
try {
  const srcDebugContent = fs.readFileSync(srcDebugPath, 'utf8');
  const publicDebugContent = fs.readFileSync(publicDebugPath, 'utf8');

  console.log('✅ Both debug tools files found. Creating modular implementation...');

  // Create modular debug tools files

  // 1. index.js - Main entry point that re-exports everything
  const indexContent = `/**
 * Debug Tools - Main Entry Point
 * 
 * This module provides a consolidated export of all debug utilities.
 * It serves as the main entry point for the debug tools package.
 */

// Re-export all components for easy access
export { default as runDiagnostics } from './diagnostics';
export { 
  enhancedLog,
  trackError,
  initializeMonitoring,
  default as setupMonitoring
} from './monitoring';
export { 
  setupGlobalErrorHandlers,
  default as setupErrorHandlers
} from './error-handling';

// For backward compatibility with the original debug-tools.js
import runDiagnostics from './diagnostics';
export default runDiagnostics;

// Set up global diagnostics in browser environment
if (typeof window !== 'undefined') {
  window.runDiagnostics = runDiagnostics;

  // Legacy console output capturing for backward compatibility
  if (!window.consoleOutput) {
    window.consoleOutput = '';
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    console.log = function (...args) {
      window.consoleOutput += args.join(' ') + '\\n';
      originalConsoleLog.apply(console, args);
    };

    console.warn = function (...args) {
      window.consoleOutput += args.join(' ') + '\\n';
      originalConsoleWarn.apply(console, args);
    };

    console.error = function (...args) {
      window.consoleOutput += args.join(' ') + '\\n';
      originalConsoleError.apply(console, args);
    };
  }
}`;

  // 2. monitoring.js - Logging and monitoring functionality
  const monitoringContent = `/**
 * Monitoring Module
 * 
 * This module provides error tracking and logging utilities.
 * It includes enhanced logging and performance monitoring.
 */

// Track errors we've already seen to avoid spamming logs
const seenErrors = new Set();

// Maximum number of errors to track in a single session
const MAX_ERRORS_PER_SESSION = 100;

// Logs with enhanced context
export function enhancedLog(level, message, data) {
  // Only use in client
  if (typeof window === 'undefined') return;

  const timestamp = new Date().toISOString();
  const context = {
    timestamp,
    url: window.location.href,
    userAgent: navigator.userAgent,
    data,
  };

  switch (level) {
    case 'info':
      console.info(\`[INFO] \${message}\`, context);
      break;
    case 'warn':
      console.warn(\`[WARNING] \${message}\`, context);
      break;
    case 'error':
      console.error(\`[ERROR] \${message}\`, context);
      break;
    case 'debug':
      console.debug(\`[DEBUG] \${message}\`, context);
      break;
  }
}

// Track errors with deduplication
export function trackError(error, source = 'unknown') {
  // Exit early if we've reached the max errors per session
  if (seenErrors.size >= MAX_ERRORS_PER_SESSION) return;

  // Create a key for this error
  const errorKey = \`\${error.name}:\${error.message}:\${error.stack?.split('\\n')[1] || ''}\`;

  // Skip if we've seen this exact error before
  if (seenErrors.has(errorKey)) return;

  // Add to seen errors
  seenErrors.add(errorKey);

  // Log the error with context
  enhancedLog('error', \`Error from \${source}: \${error.message}\`, {
    errorName: error.name,
    stack: error.stack,
    source,
  });
}

// Set up global error handlers
export function setupGlobalErrorHandlers() {
  // Only set up in browser environment
  if (typeof window === 'undefined') return;

  // Already setup check using a global flag
  if (window.__errorHandlersInitialized) return;
  window.__errorHandlersInitialized = true;

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', event => {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));

    trackError(error, 'unhandledRejection');
  });

  // Handle uncaught errors
  window.addEventListener('error', event => {
    // If this is an image loading error, handle it differently
    if (event.target && event.target.tagName === 'IMG') {
      const imgElement = event.target;
      trackError(new Error(\`Image load failed: \${imgElement.src}\`), 'imageLoadError');
      return;
    }

    trackError(
      event.error ||
        new Error(\`\${event.message} at \${event.filename}:\${event.lineno}:\${event.colno}\`),
      'uncaughtError'
    );
  });

  // Capture network errors with fetch API
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    try {
      const response = await originalFetch.apply(this, args);

      // Track API errors (4xx/5xx)
      if (!response.ok) {
        trackError(
          new Error(\`API Error: \${response.status} \${response.statusText} for \${args[0]}\`),
          'apiError'
        );
      }

      return response;
    } catch (error) {
      // Track network errors
      trackError(error instanceof Error ? error : new Error(String(error)), 'fetchError');
      throw error;
    }
  };

  enhancedLog('info', 'Global error handlers initialized');
}

// Initialize all monitoring when called
export function initializeMonitoring() {
  if (typeof window === 'undefined') return;

  try {
    // Set up global error handlers
    setupGlobalErrorHandlers();

    // Monitor performance
    if ('performance' in window) {
      // Check for slow page loads
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = performance.getEntriesByType('navigation')[0];

          if (timing && timing.domComplete > 3000) {
            enhancedLog('warn', 'Slow page load detected', {
              loadTime: timing.domComplete,
              dns: timing.domainLookupEnd - timing.domainLookupStart,
              tcp: timing.connectEnd - timing.connectStart,
              ttfb: timing.responseStart - timing.requestStart,
              download: timing.responseEnd - timing.responseStart,
              domProcessing: timing.domComplete - timing.responseEnd,
            });
          }
        }, 0);
      });
    }

    enhancedLog('info', 'Monitoring initialized');
  } catch (error) {
    console.error('Failed to initialize monitoring:', error);
  }
}

export default initializeMonitoring;`;

  // 3. diagnostics.js - Core diagnostics functionality
  const diagnosticsContent = `/**
 * Diagnostics Module
 * 
 * This module provides comprehensive diagnostic tools for the application.
 * It includes checks for performance, resource loading, and browser compatibility.
 */

import { enhancedLog, trackError } from './monitoring';

// Track all discovered issues
const issues = [];

/**
 * Run all diagnostic tests and report findings
 */
export function runDiagnostics() {
  try {
    console.group('🔍 Reality Portal Diagnostics');
    console.log('Running comprehensive diagnostics...');

    // Run all checks
    checkGlobalErrors();
    checkPerformanceIssues();
    checkResourceLoading();
    checkReactErrors();
    checkFirebaseConfig();
    checkNetworkRequests();
    checkAccessibility();
    checkBrowserCompatibility();

    // Report findings
    console.log(\`Found \${issues.length} potential issues:\`);
    issues.forEach((issue, index) => {
      console.log(\`\${index + 1}. [\${issue.severity}] \${issue.message}\`);
      if (issue.details) console.log('   Details:', issue.details);
      if (issue.fix) console.log('   Fix:', issue.fix);
    });

    console.groupEnd();
    return issues;
  } catch (error) {
    console.error('Error running diagnostics:', error);
    trackError(error, 'diagnostics');
    return [
      {
        severity: 'error',
        message: 'Diagnostic tool crashed',
        details: error.message,
      },
    ];
  }
}

/**
 * Add an issue to the tracking list
 */
function addIssue(severity, message, details, fix) {
  issues.push({ severity, message, details, fix });
  enhancedLog(severity === 'error' ? 'error' : 'warn', message, { details });
}

/**
 * Check for global JavaScript errors
 */
function checkGlobalErrors() {
  console.log('Checking for global errors...');

  // Check for 'self is not defined' errors
  if (typeof self === 'undefined') {
    addIssue(
      'error',
      "'self' is not defined in this context",
      'This might cause issues with certain libraries',
      'Add global.self = global in server-side code'
    );
  }

  // Check console errors
  if (typeof window !== 'undefined') {
    const originalConsoleError = console.error;
    let errorsCaught = 0;

    console.error = function (...args) {
      errorsCaught++;
      originalConsoleError.apply(console, args);
    };

    // Force a repaint to trigger potential errors
    document.body.style.display = 'none';
    document.body.offsetHeight; // Force reflow
    document.body.style.display = '';

    setTimeout(() => {
      console.error = originalConsoleError;
      if (errorsCaught > 0) {
        addIssue(
          'warning',
          \`\${errorsCaught} console errors detected during rendering\`,
          'Check console for detailed error messages'
        );
      }
    }, 1000);
  }
}

/**
 * Check for performance issues
 */
function checkPerformanceIssues() {
  console.log('Checking for performance issues...');

  if (typeof window === 'undefined' || !('performance' in window)) return;

  // Check page load time
  const navEntry = performance.getEntriesByType('navigation')[0];
  if (navEntry && navEntry.duration > 3000) {
    addIssue(
      'warning',
      'Slow page load detected',
      \`Page took \${Math.round(navEntry.duration)}ms to load\`,
      'Consider code splitting and optimizing critical rendering path'
    );
  }

  // Check for long tasks
  const longTasks = performance.getEntriesByType('longtask') || [];
  if (longTasks.length > 0) {
    addIssue(
      'warning',
      \`\${longTasks.length} long tasks detected (>50ms)\`,
      \`Longest task: \${Math.round(
        longTasks.reduce((max, task) => Math.max(max, task.duration), 0)
      )}ms\`,
      'Break up long-running JavaScript'
    );
  }

  // Check memory usage if available
  if (performance.memory) {
    const memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
    if (memoryUsage > 0.7) {
      addIssue(
        'warning',
        'High memory usage detected',
        \`\${Math.round(memoryUsage * 100)}% of available JS heap used\`,
        'Check for memory leaks and optimize data structures'
      );
    }
  }
}

/**
 * Check for resource loading issues
 */
function checkResourceLoading() {
  console.log('Checking for resource loading issues...');

  if (typeof window === 'undefined') return;

  // Check for failed resource loads
  const resources = performance.getEntriesByType('resource') || [];

  // Image loading errors
  const imgElements = document.querySelectorAll('img');
  imgElements.forEach(img => {
    if (!img.complete || img.naturalHeight === 0) {
      addIssue(
        'error',
        'Failed to load image',
        \`Image src: \${img.src}\`,
        'Check image path, permissions, and CORS configuration'
      );
    }
  });

  // Check for CORS issues
  resources.forEach(resource => {
    // Analyze resource timing for CORS errors
    if (
      resource.name &&
      (resource.duration === 0 || (resource.transferSize === 0 && !resource.decodedBodySize)) &&
      !resource.name.includes('data:')
    ) {
      addIssue(
        'warning',
        'Potential CORS issue detected',
        \`Resource: \${resource.name}\`,
        'Check CORS configuration and remotePatterns in next.config.js'
      );
    }
  });
}

/**
 * Check for React-specific errors
 */
function checkReactErrors() {
  console.log('Checking for React errors...');

  if (typeof window === 'undefined') return;

  // Check for React error boundaries
  const errorBoundaryDiv = document.querySelector('[data-nextjs-error-boundary]');
  if (errorBoundaryDiv) {
    addIssue(
      'error',
      'React error boundary triggered',
      errorBoundaryDiv.textContent,
      'Check component causing the error'
    );
  }

  // Check for hydration errors
  if (
    window.consoleOutput &&
    (window.consoleOutput.includes('Hydration failed') ||
      window.consoleOutput.includes('did not match'))
  ) {
    addIssue(
      'error',
      'React hydration mismatch detected',
      "Server-rendered HTML doesn't match client-side DOM",
      'Ensure components render the same content on server and client'
    );
  }
}

/**
 * Check Firebase configuration
 */
function checkFirebaseConfig() {
  console.log('Checking Firebase configuration...');

  if (typeof window === 'undefined') return;

  // Check for firebase initialization errors
  if (window.consoleOutput && window.consoleOutput.includes('Firebase App named')) {
    addIssue(
      'error',
      'Firebase app already initialized',
      'Multiple initialization calls detected',
      'Check for duplicate firebase.initializeApp() calls'
    );
  }

  // Check for missing API keys
  if (window.firebaseConfig) {
    const config = window.firebaseConfig;
    if (!config.apiKey || config.apiKey.includes('undefined')) {
      addIssue(
        'error',
        'Firebase API key missing or invalid',
        'API key is required for Firebase operations',
        'Check environment variables and firebase.ts configuration'
      );
    }
  }
}

/**
 * Check network requests
 */
function checkNetworkRequests() {
  console.log('Checking network requests...');

  if (typeof window === 'undefined') return;

  // Analyze performance entries for network issues
  const resources = performance.getEntriesByType('resource') || [];

  // Check for slow resources
  const slowResources = resources.filter(r => r.duration > 1000);
  if (slowResources.length > 0) {
    addIssue(
      'warning',
      \`\${slowResources.length} slow network requests detected\`,
      \`Slowest: \${slowResources[0].name} (\${Math.round(slowResources[0].duration)}ms)\`,
      'Consider optimizing or caching slow resources'
    );
  }

  // Check for duplicate requests
  const urls = resources.map(r => r.name);
  const duplicates = urls.filter((url, index) => urls.indexOf(url) !== index);
  const uniqueDuplicates = [...new Set(duplicates)];

  if (uniqueDuplicates.length > 0) {
    addIssue(
      'warning',
      \`\${uniqueDuplicates.length} duplicate network requests detected\`,
      \`Example: \${uniqueDuplicates[0]}\`,
      'Consider caching or deduplicating requests'
    );
  }
}

/**
 * Check for accessibility issues
 */
function checkAccessibility() {
  console.log('Checking for accessibility issues...');

  if (typeof window === 'undefined') return;

  // Check for images without alt text
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  if (imagesWithoutAlt.length > 0) {
    addIssue(
      'warning',
      \`\${imagesWithoutAlt.length} images missing alt text\`,
      "Screen readers won't be able to describe these images",
      'Add alt attributes to all images'
    );
  }
}

/**
 * Check for browser compatibility issues
 */
function checkBrowserCompatibility() {
  console.log('Checking for browser compatibility issues...');

  if (typeof window === 'undefined') return;

  // Check for modern JS features without polyfills
  const compatibilityChecks = [
    { feature: 'Intl', check: () => typeof Intl === 'undefined' },
    { feature: 'Promise', check: () => typeof Promise === 'undefined' },
    { feature: 'fetch', check: () => typeof fetch === 'undefined' },
    { feature: 'IntersectionObserver', check: () => typeof IntersectionObserver === 'undefined' },
  ];

  compatibilityChecks.forEach(({ feature, check }) => {
    if (check()) {
      addIssue(
        'warning',
        \`Browser missing \${feature} support\`,
        'This might cause issues in older browsers',
        \`Consider adding a polyfill for \${feature}\`
      );
    }
  });
}

export default runDiagnostics;`;

  // 4. error-handling.js - Error handling functionality
  const errorHandlingContent = `/**
 * Error Handling Module
 * 
 * This module provides specialized error handling capabilities
 * including global error capture and processing.
 */

import { enhancedLog, trackError } from './monitoring';

// Set up global error handlers
export function setupGlobalErrorHandlers() {
  // Only set up in browser environment
  if (typeof window === 'undefined') return;

  // Already setup check using a global flag
  if (window.__errorHandlersInitialized) return;
  window.__errorHandlersInitialized = true;

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', event => {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
    trackError(error, 'unhandledRejection');
  });

  // Handle uncaught errors
  window.addEventListener('error', event => {
    // If this is an image loading error, handle it differently
    if (event.target && event.target.tagName === 'IMG') {
      const imgElement = event.target;
      trackError(new Error(\`Image load failed: \${imgElement.src}\`), 'imageLoadError');
      return;
    }

    trackError(
      event.error ||
        new Error(\`\${event.message} at \${event.filename}:\${event.lineno}:\${event.colno}\`),
      'uncaughtError'
    );
  });

  enhancedLog('info', 'Global error handlers initialized');
}

/**
 * Process errors into a standardized format with context
 */
export function processError(error, context = {}) {
  const processed = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : new Error().stack,
    name: error instanceof Error ? error.name : 'UnknownError',
    timestamp: new Date().toISOString(),
    context
  };
  
  return processed;
}

export default setupGlobalErrorHandlers;`;

  // Create legacy wrapper for backward compatibility
  const legacyWrapper = `/**
 * @deprecated Use the modular debug tools from '@/utils/debug' instead
 */
export * from './debug';
export { default } from './debug';
`;

  // Create backups of current debug tools
  fs.copyFileSync(srcDebugPath, path.join(backupDir, 'debug-tools.js.src.bak'));
  fs.copyFileSync(publicDebugPath, path.join(backupDir, 'debug-tools.js.public.bak'));
  console.log(`✅ Created backups in ${backupDir}`);

  // Write new modular debug tools
  fs.writeFileSync(path.join(debugDir, 'index.js'), indexContent);
  fs.writeFileSync(path.join(debugDir, 'diagnostics.js'), diagnosticsContent);
  fs.writeFileSync(path.join(debugDir, 'monitoring.js'), monitoringContent);
  fs.writeFileSync(path.join(debugDir, 'error-handling.js'), errorHandlingContent);
  console.log(`✅ Created modular debug tools in ${debugDir}`);

  // Create legacy wrappers
  fs.writeFileSync(srcDebugPath, legacyWrapper);
  fs.writeFileSync(publicDebugPath, legacyWrapper);
  console.log(`✅ Created legacy wrappers for backward compatibility`);

  console.log('\n✨ Debug tools successfully consolidated!');
  console.log('\n⚠️ Consider updating imports in files that use debug tools:');
  console.log('   from: import runDiagnostics from \'@/utils/debug-tools\'');
  console.log('   to:   import { runDiagnostics } from \'@/utils/debug\'');

} catch (error) {
  console.error(`❌ Error consolidating debug tools: ${error.message}`);
  process.exit(1);
}

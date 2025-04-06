/**
 * Application monitoring and error tracking utilities
 *
 * This module provides centralized error tracking, performance monitoring,
 * and diagnostic tools to help detect and fix issues before they impact users.
 */

// Track errors we've already seen to avoid spamming logs
const seenErrors = new Set<string>();

// Maximum number of errors to track in a single session
const MAX_ERRORS_PER_SESSION = 100;

// Create a key for deduplicating errors
const getErrorKey = (error: Error): string => {
  return `${error.name}:${error.message}:${error.stack?.split('\n')[1] || ''}`;
};

// Logs with enhanced context
export function enhancedLog(
  level: 'info' | 'warn' | 'error' | 'debug',
  message: string,
  data?: any
): void {
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
      console.info(`[INFO] ${message}`, context);
      break;
    case 'warn':
      console.warn(`[WARNING] ${message}`, context);
      break;
    case 'error':
      console.error(`[ERROR] ${message}`, context);
      break;
    case 'debug':
      console.debug(`[DEBUG] ${message}`, context);
      break;
  }

  // Here you could also send to your analytics/monitoring service
  // if (window.gtag) {
  //   window.gtag('event', 'log', {
  //     level,
  //     message,
  //     ...context
  //   });
  // }
}

// Global error handler
export function setupGlobalErrorHandlers(): void {
  // Only set up in browser environment
  if (typeof window === 'undefined') return;

  // Already setup check using a global flag
  if ((window as any).__errorHandlersInitialized) return;
  (window as any).__errorHandlersInitialized = true;

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', event => {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));

    trackError(error, 'unhandledRejection');
  });

  // Handle uncaught errors
  window.addEventListener('error', event => {
    // If this is an image loading error, handle it differently
    if (event.target && (event.target as HTMLElement).tagName === 'IMG') {
      const imgElement = event.target as HTMLImageElement;
      trackError(new Error(`Image load failed: ${imgElement.src}`), 'imageLoadError');
      return;
    }

    trackError(
      event.error ||
        new Error(`${event.message} at ${event.filename}:${event.lineno}:${event.colno}`),
      'uncaughtError'
    );
  });

  // Capture network errors with fetch API
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    try {
      const response = await originalFetch.apply(this, args);
      
      // Get the URL from the request
      let url = 'unknown';
      if (typeof args[0] === 'string') {
        url = args[0];
      } else if (args[0] instanceof Request) {
        url = args[0].url;
      } else if (args[0] instanceof URL) {
        url = args[0].toString();
      } else if (args[0] && typeof args[0] === 'object') {
        // Use type assertion for object with url property
        const requestObj = args[0] as Record<string, any>;
        if (requestObj.url) url = String(requestObj.url);
      }
      
      // Only track true errors, not expected 404s or auth-related responses
      if (!response.ok) {
        // Ignore auth-related routes (common during login workflows)
        const isAuthRoute = url.includes('/auth/') || 
                           url.includes('/podmienky-pouzitia') || 
                           url.includes('/cookies') ||
                           url.includes('/reset-password');
        
        // Ignore 401/403 errors (expected for protected resources when not logged in)
        const isAuthError = response.status === 401 || response.status === 403;
        
        // Ignore 404s for static resources and expected missing routes
        const is404 = response.status === 404;
        
        // Only log true server errors (500s) or unexpected client errors
        if (!isAuthRoute && !isAuthError && (response.status >= 500 || (!is404 && response.status >= 400))) {
          trackError(
            new Error(`API Error: ${response.status} ${response.statusText} for ${url}`),
            'apiError'
          );
        } else {
          // For expected errors, just log at debug/info level
          enhancedLog('debug', `Fetch failed loading: ${response.status} for ${url}`);
        }
      }

      return response;
    } catch (error) {
      // Track actual network errors (not response errors)
      trackError(error instanceof Error ? error : new Error(String(error)), 'fetchError');
      throw error;
    }
  };

  enhancedLog('info', 'Global error handlers initialized');
}

// Track errors with deduplication
export function trackError(error: Error, source = 'unknown'): void {
  // Exit early if we've reached the max errors per session
  if (seenErrors.size >= MAX_ERRORS_PER_SESSION) return;

  // Create a key for this error
  const errorKey = getErrorKey(error);

  // Skip if we've seen this exact error before
  if (seenErrors.has(errorKey)) return;

  // Add to seen errors
  seenErrors.add(errorKey);

  // Log the error with context
  enhancedLog('error', `Error from ${source}: ${error.message}`, {
    errorName: error.name,
    stack: error.stack,
    source,
  });

  // Here you would also send to your error tracking service
  // if (window.gtag) {
  //   window.gtag('event', 'exception', {
  //     description: error.message,
  //     fatal: source === 'uncaughtError',
  //     source
  //   });
  // }
}

// Firebase-specific monitoring
export function monitorFirebaseAuth(auth: any): void {
  if (!auth) return;

  try {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(
      (user: any) => {
        enhancedLog('info', user ? 'User authenticated' : 'User signed out');
      },
      (error: any) => {
        trackError(
          error instanceof Error ? error : new Error(String(error)),
          'firebaseAuthStateError'
        );
      }
    );

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      try {
        unsubscribe();
      } catch (err) {
        // Ignore cleanup errors
      }
    });
  } catch (error) {
    trackError(
      error instanceof Error ? error : new Error(String(error)),
      'firebaseAuthMonitorSetupError'
    );
  }
}

// Detect performance issues
export function monitorPerformance(): void {
  if (typeof window === 'undefined' || !('performance' in window)) return;

  try {
    // Check for slow page loads
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

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

    // Monitor for long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver(list => {
          list.getEntries().forEach(entry => {
            if (entry.duration > 100) {
              enhancedLog('warn', 'Long task detected', {
                duration: entry.duration,
                startTime: entry.startTime,
                entryType: entry.entryType,
              });
            }
          });
        });

        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Some browsers might not support this API
      }
    }
  } catch (error) {
    trackError(
      error instanceof Error ? error : new Error(String(error)),
      'performanceMonitoringError'
    );
  }
}

// Initialize all monitoring when called
export function initializeMonitoring(auth?: any): void {
  if (typeof window === 'undefined') return;

  try {
    // Set up global error handlers
    setupGlobalErrorHandlers();

    // Monitor performance
    monitorPerformance();

    // Monitor Firebase auth if provided
    if (auth) {
      monitorFirebaseAuth(auth);
    }

    enhancedLog('info', 'Monitoring initialized');
  } catch (error) {
    console.error('Failed to initialize monitoring:', error);
  }
}

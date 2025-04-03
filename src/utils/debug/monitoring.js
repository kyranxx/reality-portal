/**
 * Monitoring Module
 * 
 * This module provides error tracking and logging utilities.
 * It's been consolidated from previous debug tools implementations.
 */

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
}

// Track errors with deduplication
export function trackError(error, source = 'unknown') {
  // Create a key for this error
  const errorKey = `${error.name}:${error.message}:${error.stack?.split('\n')[1] || ''}`;

  // Log the error with context
  enhancedLog('error', `Error from ${source}: ${error.message}`, {
    errorName: error.name,
    stack: error.stack,
    source,
  });
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

export default initializeMonitoring;

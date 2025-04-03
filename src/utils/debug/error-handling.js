/**
 * Error Handling Module
 * 
 * This module provides error capturing and handling utilities.
 * It's been consolidated from previous debug tools implementations.
 */

import { trackError, enhancedLog } from './monitoring';

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

      // Track API errors (4xx/5xx)
      if (!response.ok) {
        trackError(
          new Error(`API Error: ${response.status} ${response.statusText} for ${args[0]}`),
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

export default setupGlobalErrorHandlers;

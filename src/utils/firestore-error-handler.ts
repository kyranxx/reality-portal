/**
 * Firestore Error Handler
 *
 * This utility provides robust error handling patterns for Firestore operations.
 * It implements fallback strategies, error logging, and retry mechanisms.
 */

import { Property } from '@/utils/firebase';

// Error response structure
export interface ProcessedError {
  code: string;
  message: string;
  operation: string;
  timestamp: string;
}

/**
 * Process Firebase errors into a standardized format
 * @param error Original error from Firebase
 * @param operation Name of the operation that caused the error
 * @returns Processed error with consistent format
 */
export function handleFirebaseError(error: any, operation: string): ProcessedError {
  // Default error structure
  const processed: ProcessedError = {
    code: 'unknown-error',
    message: 'An unknown error occurred',
    operation,
    timestamp: new Date().toISOString(),
  };

  // Extract error code and message if available
  if (error) {
    if (error.code) {
      processed.code = error.code;
    }

    if (error.message) {
      processed.message = error.message;
    } else if (typeof error === 'string') {
      processed.message = error;
    }
  }

  // Map Firebase error codes to user-friendly messages
  switch (processed.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      processed.message = 'The email or password is incorrect';
      break;
    case 'auth/email-already-in-use':
      processed.message = 'This email is already in use';
      break;
    case 'auth/weak-password':
      processed.message = 'This password is too weak';
      break;
    case 'auth/network-request-failed':
      processed.message = 'Network error. Please check your connection';
      break;
    case 'auth/user-disabled':
      processed.message = 'This account has been disabled';
      break;
    case 'auth/requires-recent-login':
      processed.message = 'Please sign in again to complete this action';
      break;
    case 'permission-denied':
      processed.message = 'You do not have permission to perform this action';
      break;
    case 'not-found':
      processed.message = 'The requested data could not be found';
      break;
  }

  // Log error for debugging
  console.error(`Firebase error in ${operation}: [${processed.code}] ${processed.message}`);

  return processed;
}

/**
 * Wraps a Firestore operation with error handling
 *
 * @param operation The async Firestore operation to perform
 * @param fallback Optional fallback data to return if the operation fails
 * @param operationName Name of the operation for logging purposes
 * @param retryOptions Optional retry configuration
 * @returns The result of the operation or the fallback data
 */
export async function withFirestoreErrorHandling<T>(
  operation: () => Promise<T>,
  fallback: T | null = null,
  operationName: string = 'firestoreOperation',
  retryOptions?: { maxRetries?: number; initialDelay?: number }
): Promise<T | null> {
  // Default retry options
  const { maxRetries = 2, initialDelay = 300 } = retryOptions || {};
  let attempts = 0;
  let lastError: any = null;

  while (attempts <= maxRetries) {
    try {
      // Wait for Firebase to be ready
      await ensureFirebaseReady();

      // Perform the operation
      const result = await operation();
      
      // If we retry and succeed, log the recovery
      if (attempts > 0) {
        console.info(`Firestore operation ${operationName} succeeded after ${attempts} retries`);
      }
      
      return result;
    } catch (error: any) {
      lastError = error;
      attempts++;

      // Log the error with operation context
      console.error(`Firestore error in ${operationName} (attempt ${attempts}/${maxRetries + 1}):`, error);

      // Handle specific Firestore error types
      if (error.code) {
        // If permission-denied, immediately use fallback data without retrying
        if (error.code === 'permission-denied') {
          console.warn(`Permission denied for ${operationName}, using fallback data immediately`);
          return fallback;
        }
        handleFirestoreErrorByCode(error.code, operationName);
      }

      // If we have attempts remaining, wait and retry
      if (attempts <= maxRetries) {
        // Exponential backoff
        const delay = initialDelay * Math.pow(2, attempts - 1);
        console.info(`Retrying ${operationName} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // If we exhausted all retries, return fallback
  console.warn(`Exhausted all ${maxRetries} retries for ${operationName}, using fallback data`);
  return fallback;
}

/**
 * Ensures Firebase is initialized before proceeding
 */
async function ensureFirebaseReady(): Promise<void> {
  // Wait for Firebase to complete initialization
  if (typeof window !== 'undefined') {
    try {
      // Try to use the firebase init guard first
      const { waitForFirebaseInit } = await import('./firebase-init-guard');
      try {
        await waitForFirebaseInit();
        return;
      } catch (error) {
        console.warn('Firebase init guard failed, falling back to service check:', error);
      }
    } catch (error) {
      console.warn('Could not use firebase-init-guard, falling back to service check');
    }
    
    // Fallback to firebase service
    try {
      const firebaseService = (await import('./firebase-service')).default;
      if (!firebaseService.isInitialized()) {
        console.info('Waiting for Firebase to initialize via service...');
        await new Promise<void>((resolve, reject) => {
          // Check every 100ms if Firebase is initialized
          const checkInterval = setInterval(() => {
            if (firebaseService.isInitialized()) {
              clearInterval(checkInterval);
              clearTimeout(timeoutId);
              resolve();
            }
          }, 100);

          // Timeout after 5 seconds
          const timeoutId = setTimeout(() => {
            clearInterval(checkInterval);
            console.warn('Firebase initialization timed out, continuing anyway');
            resolve();
          }, 5000);
        });
      }
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      // Continue anyway - we'll try to use fallback data
    }
  }
}

/**
 * Handle specific Firestore error codes
 * @returns True if the error is potentially recoverable with a retry
 */
function handleFirestoreErrorByCode(code: string, operationName: string): boolean {
  let recoverable = false;
  
  switch (code) {
    case 'permission-denied':
      console.error(`Permission denied in ${operationName}. Check your Firestore rules.`);
      // Not recoverable without changing rules or auth state
      recoverable = false;
      
      // Send to monitoring for immediate attention if in production
      if (process.env.NODE_ENV === 'production') {
        try {
          // This would ideally integrate with your monitoring system
          // For now we just log with a special tag for log aggregation to pick up
          console.error(`[CRITICAL_PERMISSION_ERROR] Operation ${operationName} failed with permission denied`);
        } catch (e) {
          // Don't let monitoring failure affect the flow
        }
      }
      break;
      
    case 'not-found':
      console.warn(`Document not found in ${operationName}.`);
      // Not a real error, just missing data
      recoverable = false;
      break;
      
    case 'unavailable':
      console.error(
        `Firestore is unavailable for ${operationName}. Network issue or service outage.`
      );
      // Network errors may resolve on retry
      recoverable = true;
      break;
      
    case 'resource-exhausted':
      console.error(`Quota exceeded for ${operationName}. Throttling requests.`);
      // May succeed with backoff
      recoverable = true;
      break;
      
    case 'deadline-exceeded':
      console.error(`Operation timeout for ${operationName}. Network might be slow.`);
      // May succeed with retry
      recoverable = true;
      break;
      
    case 'unauthenticated':
      console.warn(`User not authenticated for ${operationName}. Requires sign in.`);
      
      // Attempt to refresh auth state
      try {
        const { auth } = require('./firebase');
        if (auth && auth.currentUser) {
          auth.currentUser.getIdToken(true)
            .then(() => console.log('Token refreshed successfully'))
            .catch((err: any) => console.error('Failed to refresh token:', err));
        }
      } catch (e) {
        // Ignore errors in the refresh attempt
      }
      
      // Auth errors may recover if token refreshes
      recoverable = true;
      break;
      
    default:
      console.error(`Firestore error code ${code} in ${operationName}.`);
      // Unknown errors - attempt retry for safety
      recoverable = true;
  }
  
  return recoverable;
}

/**
 * Get fallback property data for use when Firestore operations fail
 * @param count Number of fallback properties to generate
 * @returns Array of fallback property objects
 */
export function getFallbackProperties(count: number = 3): Property[] {
  const fallbackProperties: Property[] = [];

  for (let i = 0; i < count; i++) {
    fallbackProperties.push({
      id: `fallback-${i}`,
      title: `Fallback Property ${i + 1}`,
      description:
        'This is a fallback property shown when data cannot be loaded from the database.',
      price: 250000 + i * 50000,
      location: 'Bratislava',
      area: 85 + i * 10,
      propertyType: 'apartment',
      images: ['/images/placeholder.jpg'],
      isFeatured: false,
      isNew: false,
      createdAt: new Date(),
      userId: 'fallback-user',
    });
  }

  return fallbackProperties;
}

/**
 * Creates a default placeholder image for when images fail to load
 * @returns URL to placeholder image
 */
export function getPlaceholderImage(): string {
  // Creating a canvas-generated placeholder image would be ideal here,
  // but for simplicity we'll use a static image path
  return '/images/placeholder.jpg';
}

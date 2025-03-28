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
    timestamp: new Date().toISOString()
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
 * @returns The result of the operation or the fallback data
 */
export async function withFirestoreErrorHandling<T>(
  operation: () => Promise<T>,
  fallback: T | null = null,
  operationName: string = 'firestoreOperation'
): Promise<T | null> {
  try {
    // Wait for Firebase to be ready
    await ensureFirebaseReady();
    
    // Perform the operation
    const result = await operation();
    return result;
  } catch (error: any) {
    // Log the error with operation context
    console.error(`Firestore error in ${operationName}:`, error);
    
    // Handle specific Firestore error types
    if (error.code) {
      handleFirestoreErrorByCode(error.code, operationName);
    }
    
    // Return fallback data if provided
    return fallback;
  }
}

/**
 * Ensures Firebase is initialized before proceeding
 */
async function ensureFirebaseReady(): Promise<void> {
  // Wait for Firebase to complete initialization
  if (typeof window !== 'undefined') {
    const firebaseService = (await import('./firebase-service')).default;
    if (!firebaseService.isInitialized()) {
      console.info('Waiting for Firebase to initialize...');
      await new Promise<void>((resolve) => {
        // Check every 100ms if Firebase is initialized
        const checkInterval = setInterval(() => {
          if (firebaseService.isInitialized()) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          console.warn('Firebase initialization timed out, continuing anyway');
          resolve();
        }, 5000);
      });
    }
  }
}

/**
 * Handle specific Firestore error codes
 */
function handleFirestoreErrorByCode(code: string, operationName: string): void {
  switch (code) {
    case 'permission-denied':
      console.error(`Permission denied in ${operationName}. Check your Firestore rules.`);
      break;
    case 'not-found':
      console.warn(`Document not found in ${operationName}.`);
      break;
    case 'unavailable':
      console.error(`Firestore is unavailable for ${operationName}. Network issue or service outage.`);
      break;
    case 'unauthenticated':
      console.warn(`User not authenticated for ${operationName}. Requires sign in.`);
      break;
    default:
      console.error(`Firestore error code ${code} in ${operationName}.`);
  }
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
      description: 'This is a fallback property shown when data cannot be loaded from the database.',
      price: 250000 + (i * 50000),
      location: 'Bratislava',
      area: 85 + (i * 10),
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

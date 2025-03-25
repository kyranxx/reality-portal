/**
 * Firestore Error Handler
 * 
 * This utility provides error handling for Firestore operations
 * with fallback data strategies to prevent UI errors.
 */

import { FirebaseError } from 'firebase/app';
import { Property } from './firebase';

/**
 * Processes Firebase errors with custom handling logic
 * @param error The error to process
 * @param context Optional context information for logging
 * @returns Formatted error object with code, message, and fallback flag
 */
export const handleFirebaseError = (error: unknown, context = 'operation'): { 
  code: string; 
  message: string;
  isFallback: boolean;
} => {
  // Default error structure
  const defaultError = {
    code: 'unknown-error',
    message: 'An unexpected error occurred',
    isFallback: true
  };
  
  // Handle Firebase-specific errors
  if (error instanceof FirebaseError) {
    // Log the error for debugging
    console.error(`Firebase error in ${context}:`, error.code, error.message);
    
    // Extract useful information for the user
    return {
      code: error.code,
      message: getFirebaseErrorMessage(error.code),
      isFallback: true
    };
  }
  
  // Handle any other errors
  console.error(`Error in ${context}:`, error);
  
  // If it's a standard Error object
  if (error instanceof Error) {
    return {
      code: 'client-error',
      message: error.message || defaultError.message,
      isFallback: true
    };
  }
  
  return defaultError;
};

/**
 * Get user-friendly error messages for Firebase error codes
 */
export const getFirebaseErrorMessage = (code: string): string => {
  switch (code) {
    case 'permission-denied':
    case 'PERMISSION_DENIED':
      return 'You do not have permission to access this data. Please log in or contact support.';
    
    case 'not-found':
    case 'DOCUMENT_NOT_FOUND':
      return 'The requested information could not be found.';
    
    case 'unavailable':
    case 'UNAVAILABLE':
      return 'The service is currently unavailable. Please try again later.';
    
    case 'unauthenticated':
    case 'UNAUTHENTICATED':
      return 'You need to be logged in to access this information.';
    
    case 'cancelled':
    case 'CANCELLED':
      return 'The operation was cancelled.';
    
    case 'data-loss':
    case 'DATA_LOSS':
      return 'Some data could not be retrieved. Please try again.';
    
    case 'deadline-exceeded':
    case 'DEADLINE_EXCEEDED':
      return 'The operation timed out. Please try again.';
    
    case 'already-exists':
    case 'ALREADY_EXISTS':
      return 'This information already exists.';
    
    default:
      return 'An error occurred while accessing the database. Please try again later.';
  }
};

/**
 * Generate fallback property data for when Firestore access fails
 * @param count Number of fallback properties to generate
 * @returns Array of fallback property objects
 */
export const getFallbackProperties = (count = 3): Property[] => {
  const fallbackProperties: Property[] = [];
  
  for (let i = 0; i < count; i++) {
    // Create fallback property with required fields
    // Using type assertion to add the temporary isFallback flag
    fallbackProperties.push({
      id: `fallback-${i}`,
      createdAt: new Date(),
      title: `Fallback Property ${i + 1}`,
      description: 'Property data is temporarily unavailable. Please try again later.',
      price: 0,
      location: 'Location unavailable',
      area: 0,
      propertyType: 'apartment',
      userId: 'system',
      images: [`https://placehold.co/600x400?text=Property+${i + 1}`],
      isNew: true // Use existing optional property instead of custom isFallback
    } as Property);
  }
  
  return fallbackProperties;
};

/**
 * Wraps Firestore operations with error handling and fallback data
 * @param operation The Firestore operation to perform
 * @param fallbackData Fallback data to return if the operation fails
 * @returns Result of the operation or fallback data
 */
export async function withFirestoreErrorHandling<T>(
  operation: () => Promise<T>,
  fallbackData: T,
  context = 'firestore'
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    // Handle and log the error
    const processedError = handleFirebaseError(error, context);
    
    // Return fallback data to prevent UI breakage
    return fallbackData;
  }
}

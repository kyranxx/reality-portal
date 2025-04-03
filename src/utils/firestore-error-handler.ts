/**
 * @deprecated Import from '@/utils/firebase/firestore' instead.
 * This file is kept for backward compatibility.
 */

export * from './firebase/firestore';

// Create a default export for backward compatibility
import * as firestoreModule from './firebase/firestore';
export default firestoreModule;

// Add error handling utilities for backward compatibility
import { Property } from './firebase/index';

/**
 * Higher-order function that wraps a Firestore operation with error handling
 * @param operation - The async Firestore operation to execute
 * @param fallback - Optional fallback value to return in case of error
 * @param errorCallback - Optional callback to handle errors
 */
export function withFirestoreErrorHandling<T>(
  operation: () => Promise<T>,
  fallback?: T,
  errorCallback?: (error: any) => void
): Promise<T> {
  console.warn('withFirestoreErrorHandling is using deprecated adapter. Update imports to new Firebase structure.');
  
  return operation().catch(error => {
    console.error('Firestore operation error:', error);
    
    // Call error callback if provided
    if (errorCallback) {
      errorCallback(error);
    }
    
    if (fallback !== undefined) {
      console.warn('Using fallback data due to Firestore error');
      return fallback;
    }
    
    throw error;
  });
}

/**
 * Returns fallback properties to use when Firestore is unavailable
 */
export function getFallbackProperties(): Property[] {
  console.warn('getFallbackProperties is using deprecated adapter. Update imports to new Firebase structure.');
  
  return [
    {
      id: 'fallback-1',
      title: 'Fallback Property 1',
      description: 'This is a fallback property used when Firestore is unavailable',
      price: 250000,
      location: 'Bratislava, Slovakia',
      area: 85,
      rooms: 3,
      propertyType: 'apartment',
      userId: 'system',
      images: ['/images/samples/property-1.jpg'],
      isFeatured: true,
      isNew: true,
      createdAt: new Date()
    },
    {
      id: 'fallback-2',
      title: 'Fallback Property 2',
      description: 'Another fallback property used when Firestore is unavailable',
      price: 180000,
      location: 'Košice, Slovakia',
      area: 65,
      rooms: 2,
      propertyType: 'apartment',
      userId: 'system',
      images: ['/images/samples/property-2.jpg'],
      createdAt: new Date()
    }
  ];
}

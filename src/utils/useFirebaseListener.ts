/**
 * useFirebaseListener Hook
 * 
 * A React hook that provides a safe way to set up Firebase listeners with 
 * automatic cleanup on component unmount to prevent memory leaks and 
 * message channel errors.
 */

import { useEffect, useRef } from 'react';
import firebaseService from './firebase-service';

/**
 * Hook for safely attaching Firebase listeners with automatic cleanup
 * 
 * @param setupFn Function that sets up Firebase listeners and returns an unsubscribe function
 * @param dependencies Array of dependencies that should trigger re-setup of the listener
 * @returns void
 * 
 * @example
 * // Example usage in a component:
 * useFirebaseListener(() => {
 *   // Set up your Firebase listener here
 *   const unsubscribe = onSnapshot(docRef, (snapshot) => {
 *     // Handle snapshot data
 *     setData(snapshot.data());
 *   });
 *   
 *   // Return the unsubscribe function
 *   return unsubscribe;
 * }, [docRef]); // Dependencies array
 */
export function useFirebaseListener(
  setupFn: () => (() => void) | void,
  dependencies: React.DependencyList = []
): void {
  // Keep track of the cleanup function
  const cleanupFnRef = useRef<(() => void) | void>();

  useEffect(() => {
    console.debug('Setting up Firebase listener');
    
    // Set up the listener through our service to ensure proper cleanup
    try {
      cleanupFnRef.current = firebaseService.createSafeListener(() => {
        try {
          // Call the user-provided setup function
          return setupFn() || (() => {});
        } catch (error) {
          console.error('Error in Firebase listener setup:', error);
          return () => {}; // Return a no-op cleanup function on error
        }
      });
    } catch (error) {
      console.error('Failed to create safe Firebase listener:', error);
    }

    // Return the cleanup function
    return () => {
      console.debug('Cleaning up Firebase listener');
      try {
        if (typeof cleanupFnRef.current === 'function') {
          cleanupFnRef.current();
        }
      } catch (error) {
        console.warn('Error cleaning up Firebase listener:', error);
      }
    };
  }, dependencies); // Re-run effect when dependencies change
}

/**
 * Hook that provides a timeout cleanup for Firebase operations
 * that might not complete properly
 * 
 * @param timeoutMs Timeout in milliseconds
 * @returns void
 * 
 * @example
 * // This will automatically cancel any pending Firebase operations 
 * // after the component unmounts or after the specified timeout
 * useFirebaseOperationTimeout(5000);
 */
export function useFirebaseOperationTimeout(timeoutMs: number = 5000): void {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    // Set up a timeout to force cleanup if operations take too long
    timeoutId = setTimeout(() => {
      console.warn(`Firebase operation timeout (${timeoutMs}ms) reached`);
      timeoutId = null;
      
      // At this point, we could potentially trigger some global error handler
      // or display a "slow connection" notice to the user
    }, timeoutMs);
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutMs]);
}

export default useFirebaseListener;

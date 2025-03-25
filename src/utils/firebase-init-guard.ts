/**
 * Firebase Auth Initialization Guard
 * 
 * This utility ensures that Firebase Auth is fully initialized before it's used,
 * preventing "Component auth has not been registered yet" errors.
 */

import { auth } from './firebase';

// Track if auth is already initialized
let authInitialized = false;

// Promise that resolves when auth is ready
const authInitPromise = new Promise<void>((resolve) => {
  // Listen for the first auth state change, which happens when auth is ready
  const unsubscribe = auth.onAuthStateChanged(() => {
    // Mark as initialized and remove the listener
    authInitialized = true;
    unsubscribe();
    resolve();
  });
});

/**
 * Waits for Firebase Auth to be fully initialized
 * @returns Promise that resolves when auth is ready
 */
export const waitForAuth = async (): Promise<void> => {
  // If already initialized, return immediately
  if (authInitialized) {
    return Promise.resolve();
  }
  
  // Otherwise wait for initialization to complete
  return authInitPromise;
};

// Export a utility to check if auth is initialized
export const isAuthInitialized = (): boolean => authInitialized;

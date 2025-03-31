/**
 * Firebase Initialization Guard
 * 
 * This module ensures Firebase services are fully initialized before use.
 * It provides a safe way to access Firebase services and prevents race conditions.
 */

import { app, auth, db, storage } from './firebase';
import firebaseService from './firebase-service';

// Initialize state tracking
let isFirebaseInitialized = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Initializes Firebase and returns a promise that resolves when initialization is complete
 */
export const initializeFirebase = (): Promise<void> => {
  if (initializationPromise) {
    return initializationPromise;
  }

  // Create the initialization promise
  initializationPromise = new Promise((resolve) => {
    // First check if firebase-service is already initialized
    if (firebaseService.isInitialized()) {
      isFirebaseInitialized = true;
      resolve();
      return;
    }

    // Set up an interval to check for Firebase initialization
    const checkInterval = setInterval(() => {
      // Check both the firebase-service and the individual modules
      if (
        firebaseService.isInitialized() ||
        (app && auth && db && storage)
      ) {
        isFirebaseInitialized = true;
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);

    // Set a timeout to avoid hanging indefinitely
    setTimeout(() => {
      if (!isFirebaseInitialized) {
        console.warn('Firebase initialization timed out after 10 seconds');
        clearInterval(checkInterval);
        resolve(); // Resolve anyway to prevent hanging
      }
    }, 10000);
  });

  return initializationPromise;
};

/**
 * Checks if Firebase is initialized
 */
export const isFirebaseReady = (): boolean => {
  return isFirebaseInitialized;
};

/**
 * Waits for Firebase to be initialized
 */
export const waitForFirebase = async (): Promise<void> => {
  if (isFirebaseInitialized) {
    return Promise.resolve();
  }
  return initializeFirebase();
};

/**
 * Wraps a function to ensure Firebase is initialized before execution
 * @param fn Function to wrap
 * @returns Wrapped function that ensures Firebase is initialized
 */
export function withFirebase<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    await waitForFirebase();
    return fn(...args);
  };
}

// Initialize Firebase automatically when this module is imported
if (typeof window !== 'undefined') {
  initializeFirebase();
}

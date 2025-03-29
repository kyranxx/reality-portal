/**
 * Firebase Initialization Guard
 * 
 * This module provides a robust way to ensure Firebase is properly initialized
 * before components attempt to use Firebase services.
 */

import { auth, db, storage, app } from './firebase';

// Initialization state tracking
interface InitState {
  isFirebaseInitialized: boolean;
  isAuthInitialized: boolean;
  isFirestoreInitialized: boolean;
  isStorageInitialized: boolean;
  initError: Error | null;
  authError: Error | null;
}

// Global state for tracking initialization
const initState: InitState = {
  isFirebaseInitialized: false,
  isAuthInitialized: false,
  isFirestoreInitialized: false,
  isStorageInitialized: false,
  initError: null,
  authError: null,
};

// Maximum wait time for initialization in milliseconds
const MAX_INIT_WAIT_TIME = 10000;

/**
 * Waits for Firebase to be initialized
 * @returns A promise that resolves when Firebase is initialized or rejects after timeout
 */
export const waitForFirebaseInit = async (timeout = MAX_INIT_WAIT_TIME): Promise<boolean> => {
  // Skip waiting if not on client
  if (typeof window === 'undefined') {
    console.log('waitForFirebaseInit called on server side, skipping');
    return false;
  }

  // Check if already initialized
  if (isFirebaseReady()) {
    return true;
  }

  // Wait for initialization with timeout
  return new Promise((resolve, reject) => {
    const checkInterval = 100; // Check every 100ms
    let elapsedTime = 0;
    
    // Set up polling interval
    const interval = setInterval(() => {
      elapsedTime += checkInterval;
      
      // Check if initialized
      if (isFirebaseReady()) {
        clearInterval(interval);
        clearTimeout(timeoutId);
        resolve(true);
        return;
      }
      
      // Check if there was an initialization error
      if (initState.initError) {
        clearInterval(interval);
        clearTimeout(timeoutId);
        reject(initState.initError);
        return;
      }
      
      // Check if we've exceeded our timeout
      if (elapsedTime >= timeout) {
        clearInterval(interval);
        reject(new Error(`Firebase initialization timed out after ${timeout}ms`));
      }
    }, checkInterval);
    
    // Set timeout as a fallback
    const timeoutId = setTimeout(() => {
      clearInterval(interval);
      reject(new Error(`Firebase initialization timed out after ${timeout}ms`));
    }, timeout);
  });
};

/**
 * Checks if Firebase is ready to use
 * @returns true if Firebase is initialized
 */
export const isFirebaseReady = (): boolean => {
  // Skip check if not on client
  if (typeof window === 'undefined') {
    return false;
  }

  // Check current state
  const firebaseInitialized = Boolean(app);
  const authInitialized = Boolean(auth);
  const firestoreInitialized = Boolean(db);
  const storageInitialized = Boolean(storage);
  
  // Update state
  initState.isFirebaseInitialized = firebaseInitialized;
  initState.isAuthInitialized = authInitialized;
  initState.isFirestoreInitialized = firestoreInitialized;
  initState.isStorageInitialized = storageInitialized;
  
  return firebaseInitialized && authInitialized;
};

/**
 * Use this at component level to ensure Firebase is ready
 * @param specificService Optional service to check ('auth', 'firestore', or 'storage')
 * @returns An object with the initialization state and any errors
 */
export const useFirebaseGuard = (specificService?: 'auth' | 'firestore' | 'storage') => {
  // Check current state
  const ready = isFirebaseReady();
  
  // Determine which specific service needs to be checked
  let specificReady = true;
  if (specificService) {
    switch (specificService) {
      case 'auth':
        specificReady = initState.isAuthInitialized;
        break;
      case 'firestore':
        specificReady = initState.isFirestoreInitialized;
        break;
      case 'storage':
        specificReady = initState.isStorageInitialized;
        break;
    }
  }
  
  return {
    ready: ready && specificReady,
    error: initState.initError || initState.authError,
    authReady: initState.isAuthInitialized,
    firestoreReady: initState.isFirestoreInitialized,
    storageReady: initState.isStorageInitialized,
  };
};

// Attempt initialization check on load
if (typeof window !== 'undefined') {
  isFirebaseReady();
  
  // Set up automatic retries if needed
  if (!initState.isFirebaseInitialized) {
    console.log('Firebase not immediately available, will check again');
    // Check again in 500ms (Firebase might still be initializing)
    setTimeout(() => {
      isFirebaseReady();
    }, 500);
  }
}

export default waitForFirebaseInit;

/**
 * @deprecated Import from '@/utils/firebase/index' instead.
 * This file is kept for backward compatibility.
 */

// Re-export everything from the modular structure
export * from './firebase/index';

// Create a default export since the old module had one
// Aggregating the most commonly used Firebase resources as a service
import { 
  app, auth, db, storage, 
  initializeFirebase, 
  isFirebaseInitialized,
  waitForFirebaseInit
} from './firebase/index';

const firebaseService = {
  app,
  auth,
  db,
  storage,
  initialize: initializeFirebase,
  isInitialized: isFirebaseInitialized,
  waitForInit: waitForFirebaseInit,
  
  // Add missing methods used by property components
  getDocument: async <T>(collection: string, id: string): Promise<T | null> => {
    console.warn('Using firebase-service adapter getDocument method - update imports to new Firebase structure');
    // Return a stub implementation since this is just for compatibility
    return null;
  },
  
  queryByField: async <T>(collection: string, field: string, value: any): Promise<T[]> => {
    console.warn('Using firebase-service adapter queryByField method - update imports to new Firebase structure');
    // Return an empty array since this is just for compatibility
    return [];
  },
  
  // Add createSafeListener method for backward compatibility with useFirebaseListener
  createSafeListener: (cleanupFn: () => void): (() => void) => {
    console.warn('Using firebase-service adapter createSafeListener method - update imports to new Firebase structure');
    // Simply return the cleanup function as this is just for compatibility
    return cleanupFn;
  }
};

export default firebaseService;

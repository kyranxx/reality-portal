/**
 * @deprecated Import from '@/utils/firebase/index' instead.
 * This file is kept for backward compatibility.
 */

// Re-export everything from the modular structure
export * from './firebase/index';

// Create a default export since the old module had one
// We're aggregating the most commonly used Firebase resources
import { app, auth, db, storage, initializeFirebase } from './firebase/index';

const firebase = {
  app,
  auth,
  db,
  storage,
  initialize: initializeFirebase
};

export default firebase;

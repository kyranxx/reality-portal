/**
 * Firestore Adapter
 * 
 * @deprecated This adapter is provided for backward compatibility with the old Firebase structure.
 * Please update import paths to use the new modular structure in src/utils/firebase/ directory.
 */

// Re-export from the new modular structure
export * from './firebase/firestore';
// Export as a namespace for backward compatibility
import * as firestore from './firebase/firestore';
export default firestore;

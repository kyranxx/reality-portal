/**
 * Firebase Auth Adapter
 * 
 * @deprecated This adapter is provided for backward compatibility with the old Firebase structure.
 * Please update import paths to use the new modular structure in src/utils/firebase/ directory.
 */

// Re-export from the new modular structure
export * from './firebase/auth';
// Export as a namespace for backward compatibility
import * as auth from './firebase/auth';
export default auth;

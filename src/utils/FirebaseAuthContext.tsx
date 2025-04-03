/**
 * @deprecated Import from '@/utils/firebase/auth-context' instead.
 * This file is kept for backward compatibility.
 */

export * from './firebase/auth-context';
export { default } from './firebase/auth-context';

// Re-export AuthProvider as FirebaseAuthProvider for backward compatibility
import { AuthProvider } from './firebase/auth-context';
export { AuthProvider as FirebaseAuthProvider };

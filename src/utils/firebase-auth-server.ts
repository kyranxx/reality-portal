/**
 * Firebase Auth server-side implementation
 * Used in server environments (non-Vercel)
 */

// Define types for Firebase Auth
export type Auth = any;
export type User = any;
export type UserCredential = any;
export type AuthProvider = any;
export type AuthError = any;

// Create dummy implementations for server-side
export const onAuthStateChanged = () => {
  console.log('Server-side onAuthStateChanged called (no-op)');
  return () => {}; // Return empty unsubscribe function
};

export const createUserWithEmailAndPassword = async () => {
  console.log('Server-side createUserWithEmailAndPassword called (no-op)');
  throw new Error('Authentication operations cannot be performed on the server');
};

export const signInWithEmailAndPassword = async () => {
  console.log('Server-side signInWithEmailAndPassword called (no-op)');
  throw new Error('Authentication operations cannot be performed on the server');
};

export const signOut = async () => {
  console.log('Server-side signOut called (no-op)');
  throw new Error('Authentication operations cannot be performed on the server');
};

export class GoogleAuthProvider {
  static credential() {
    return {};
  }
  addScope() {}
  setCustomParameters() {}
}

export const signInWithPopup = async () => {
  console.log('Server-side signInWithPopup called (no-op)');
  throw new Error('Authentication operations cannot be performed on the server');
};

export const sendPasswordResetEmail = async () => {
  console.log('Server-side sendPasswordResetEmail called (no-op)');
  throw new Error('Authentication operations cannot be performed on the server');
};

export const getAuth = () => {
  console.log('Server-side getAuth called (no-op)');
  return {};
};

export const connectAuthEmulator = () => {
  console.log('Server-side connectAuthEmulator called (no-op)');
};

// Log initialization
console.log('Initialized firebase-auth-server (non-Vercel)');

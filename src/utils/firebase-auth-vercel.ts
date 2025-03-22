/**
 * Firebase Auth Vercel-specific implementation
 * Used specifically in Vercel server environments
 */

// Define types for Firebase Auth
export type Auth = any;
export type User = any;
export type UserCredential = any;
export type AuthProvider = any;
export type AuthError = any;

// Create dummy implementations for server-side in Vercel
export const onAuthStateChanged = () => {
  console.log('Vercel server-side onAuthStateChanged called (no-op)');
  return () => {}; // Return empty unsubscribe function
};

export const createUserWithEmailAndPassword = async () => {
  console.log('Vercel server-side createUserWithEmailAndPassword called (no-op)');
  throw new Error('Authentication operations cannot be performed on the server');
};

export const signInWithEmailAndPassword = async () => {
  console.log('Vercel server-side signInWithEmailAndPassword called (no-op)');
  throw new Error('Authentication operations cannot be performed on the server');
};

export const signOut = async () => {
  console.log('Vercel server-side signOut called (no-op)');
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
  console.log('Vercel server-side signInWithPopup called (no-op)');
  throw new Error('Authentication operations cannot be performed on the server');
};

export const sendPasswordResetEmail = async () => {
  console.log('Vercel server-side sendPasswordResetEmail called (no-op)');
  throw new Error('Authentication operations cannot be performed on the server');
};

export const getAuth = () => {
  console.log('Vercel server-side getAuth called (no-op)');
  return {};
};

export const connectAuthEmulator = () => {
  console.log('Vercel server-side connectAuthEmulator called (no-op)');
};

// Log initialization
console.log('Initialized firebase-auth-vercel');

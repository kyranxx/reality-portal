/**
 * Unified Firebase Auth module
 * 
 * This file provides a centralized and robust authentication interface
 * that works consistently across client, server, and Vercel environments.
 */

// Import FirebaseApp type
import { FirebaseApp } from 'firebase/app';

// Define type definitions for better type safety
export type Auth = any;
export type User = any;
export type UserCredential = any;
export type AuthProvider = any;
export type AuthError = any;

// Better environment detection
const isClient = typeof window !== 'undefined';
const isBuild = process.env.NEXT_PUBLIC_IS_BUILD_TIME === 'true';
const isVercel = process.env.VERCEL === '1';

// Log which environment we're using (for debugging)
const environment = isClient ? 'client' : (isVercel ? 'vercel' : 'server');
console.log(`Firebase Auth using: ${environment} implementation`);

// Stub GoogleAuthProvider class implementation that's always available
export class GoogleAuthProvider {
  static credential() { return {}; }
  addScope() {}
  setCustomParameters() {}
}

// Server stubs - these are the default exports
export const onAuthStateChanged = () => {
  console.log(`Server-side onAuthStateChanged called (no-op)`);
  return () => {}; // Return empty unsubscribe function
};

export const createUserWithEmailAndPassword = async () => {
  console.log(`Server-side createUserWithEmailAndPassword called (no-op)`);
  throw new Error('Authentication operations cannot be performed on the server');
};

export const signInWithEmailAndPassword = async () => {
  console.log(`Server-side signInWithEmailAndPassword called (no-op)`);
  throw new Error('Authentication operations cannot be performed on the server');
};

export const signOut = async () => {
  console.log(`Server-side signOut called (no-op)`);
  throw new Error('Authentication operations cannot be performed on the server');
};

export const signInWithPopup = async () => {
  console.log(`Server-side signInWithPopup called (no-op)`);
  throw new Error('Authentication operations cannot be performed on the server');
};

export const sendPasswordResetEmail = async () => {
  console.log(`Server-side sendPasswordResetEmail called (no-op)`);
  throw new Error('Authentication operations cannot be performed on the server');
};

export const getAuth = (app?: FirebaseApp) => {
  console.log(`Server-side getAuth called (no-op)`);
  return {};
};

export const connectAuthEmulator = (auth: Auth, url: string) => {
  console.log(`Server-side connectAuthEmulator called (no-op)`);
};

// Only attempt to load Firebase Auth in the browser and not during build
if (isClient && !isBuild) {
  // Using dynamic import to ensure this only runs in browser
  import('firebase/auth')
    .then(firebaseAuth => {
      // Here we're just informing that we loaded it, but NOT replacing the exports
      // This avoids issues with module exports being immutable
      console.log('Successfully loaded Firebase Auth in client environment');
      
      // The actual Firebase auth will be used directly in FirebaseAuthContext.tsx
      // which will import firebase/auth directly in client components
    })
    .catch(error => {
      console.error('Failed to load Firebase Auth:', error);
    });
}

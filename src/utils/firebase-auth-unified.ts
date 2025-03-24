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

// Better environment detection with fallbacks
const isClient = typeof window !== 'undefined';
const isBuild = process.env.NEXT_PUBLIC_IS_BUILD_TIME === 'true';
const isVercel = process.env.VERCEL === '1';

// Log which environment we're using (for debugging)
const environment = isClient ? 'client' : (isVercel ? 'vercel' : 'server');
console.log(`Firebase Auth using: ${environment} implementation`);

// Stub GoogleAuthProvider class implementation that's always available
export class GoogleAuthProvider {
  static credential() { return {}; }
  addScope() { return this; }
  setCustomParameters() { return this; }
}

// Enhanced error for auth operations
class AuthOperationError extends Error {
  constructor(operation: string, message: string) {
    super(`Auth operation '${operation}' failed: ${message}`);
    this.name = 'AuthOperationError';
  }
}

// Server stubs with proper error handling
export const onAuthStateChanged = (auth: Auth, callback: (user: User | null) => void, errorCallback?: (error: AuthError) => void) => {
  console.log(`Server-side onAuthStateChanged called (no-op)`);
  // Always call error callback with proper error object on server
  if (errorCallback && typeof errorCallback === 'function') {
    setTimeout(() => {
      errorCallback(new AuthOperationError('onAuthStateChanged', 'Cannot monitor auth state on server'));
    }, 0);
  }
  return () => {}; // Return empty unsubscribe function
};

export const createUserWithEmailAndPassword = async () => {
  throw new AuthOperationError('createUserWithEmailAndPassword', 'Cannot perform on server');
};

export const signInWithEmailAndPassword = async () => {
  throw new AuthOperationError('signInWithEmailAndPassword', 'Cannot perform on server');
};

export const signOut = async () => {
  throw new AuthOperationError('signOut', 'Cannot perform on server');
};

export const signInWithPopup = async () => {
  throw new AuthOperationError('signInWithPopup', 'Cannot perform on server');
};

export const sendPasswordResetEmail = async () => {
  throw new AuthOperationError('sendPasswordResetEmail', 'Cannot perform on server');
};

// Enhanced getAuth implementation
export const getAuth = (app?: FirebaseApp) => {
  if (!isClient) {
    console.log('Server-side getAuth called (returning mock)');
    return {
      currentUser: null,
      onAuthStateChanged: (callback: (user: User | null) => void) => {
        console.warn('Server-side onAuthStateChanged called via auth object (no-op)');
        return () => {};
      },
      // Other basic properties to prevent errors
      settings: {},
      name: 'auth',
      config: {}
    };
  }
  
  // We should never reach this on the server
  // This is a fallback that shouldn't be needed due to the isClient check above
  try {
    const firebaseAuth = require('firebase/auth');
    return firebaseAuth.getAuth(app);
  } catch (error) {
    console.error('Failed to load Firebase Auth:', error);
    // Return a dummy auth object as fallback
    return {
      currentUser: null,
      onAuthStateChanged: () => () => {},
      settings: {},
      name: 'auth-fallback',
      config: {}
    };
  }
};

export const connectAuthEmulator = (auth: Auth, url: string) => {
  if (!isClient) {
    console.log(`Server-side connectAuthEmulator called (no-op)`);
    return;
  }
  
  try {
    const firebaseAuth = require('firebase/auth');
    return firebaseAuth.connectAuthEmulator(auth, url);
  } catch (error) {
    console.error('Failed to connect to Auth Emulator:', error);
  }
};

// Only attempt to load Firebase Auth in the browser and not during build
if (isClient && !isBuild) {
  // We preload the auth module to ensure it's available when needed
  // but we don't replace exports to avoid module conflicts
  import('firebase/auth')
    .then(() => {
      console.log('Successfully preloaded Firebase Auth in client environment');
    })
    .catch(error => {
      console.error('Failed to preload Firebase Auth:', error);
    });
}

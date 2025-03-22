/**
 * Unified Firebase Auth module
 * 
 * This file provides a centralized and robust authentication interface
 * that works consistently across client, server, and Vercel environments.
 */

// Define type definitions for better type safety
export type Auth = any;
export type User = any;
export type UserCredential = any;
export type AuthProvider = any;
export type AuthError = any;

// Environment detection (consolidated in one place)
const isClient = typeof window !== 'undefined';
const isVercel = !isClient && typeof process !== 'undefined' && process.env?.VERCEL === '1';
const environment = isClient ? 'client' : (isVercel ? 'vercel' : 'server');

// Log which environment we're using (for debugging)
console.log(`Firebase Auth using: ${environment} implementation`);

// Stub GoogleAuthProvider class implementation
export class GoogleAuthProvider {
  static credential() { return {}; }
  addScope() {}
  setCustomParameters() {}
}

// Create stub implementations for server environments
const createServerStubs = (isVercel: boolean) => {
  const envName = isVercel ? 'Vercel server-side' : 'Server-side';
  
  return {
    // Empty implementation that returns a no-op unsubscribe function
    onAuthStateChanged: () => {
      console.log(`${envName} onAuthStateChanged called (no-op)`);
      return () => {}; // Return empty unsubscribe function
    },
    
    // Auth operations that are not possible on the server
    createUserWithEmailAndPassword: async () => {
      console.log(`${envName} createUserWithEmailAndPassword called (no-op)`);
      throw new Error('Authentication operations cannot be performed on the server');
    },
    
    signInWithEmailAndPassword: async () => {
      console.log(`${envName} signInWithEmailAndPassword called (no-op)`);
      throw new Error('Authentication operations cannot be performed on the server');
    },
    
    signOut: async () => {
      console.log(`${envName} signOut called (no-op)`);
      throw new Error('Authentication operations cannot be performed on the server');
    },
    
    signInWithPopup: async () => {
      console.log(`${envName} signInWithPopup called (no-op)`);
      throw new Error('Authentication operations cannot be performed on the server');
    },
    
    sendPasswordResetEmail: async () => {
      console.log(`${envName} sendPasswordResetEmail called (no-op)`);
      throw new Error('Authentication operations cannot be performed on the server');
    },
    
    // Return an empty auth object
    getAuth: () => {
      console.log(`${envName} getAuth called (no-op)`);
      return {};
    },
    
    // No-op for emulator connection
    connectAuthEmulator: () => {
      console.log(`${envName} connectAuthEmulator called (no-op)`);
    },
  };
};

// Export functions based on environment
let exportedAuth: any;

// For client environments, we need actual implementations
if (isClient) {
  try {
    // Only import actual Firebase Auth on client-side
    const { 
      GoogleAuthProvider: ActualGoogleAuthProvider,
      getAuth: actualGetAuth,
      onAuthStateChanged: actualOnAuthStateChanged,
      createUserWithEmailAndPassword: actualCreateUserWithEmailAndPassword,
      signInWithEmailAndPassword: actualSignInWithEmailAndPassword,
      signInWithPopup: actualSignInWithPopup,
      signOut: actualSignOut,
      sendPasswordResetEmail: actualSendPasswordResetEmail,
      connectAuthEmulator: actualConnectAuthEmulator
    } = require('firebase/auth');
    
    // Export real Firebase auth methods on client
    exportedAuth = {
      GoogleAuthProvider: ActualGoogleAuthProvider,
      getAuth: actualGetAuth,
      onAuthStateChanged: actualOnAuthStateChanged,
      createUserWithEmailAndPassword: actualCreateUserWithEmailAndPassword,
      signInWithEmailAndPassword: actualSignInWithEmailAndPassword,
      signInWithPopup: actualSignInWithPopup,
      signOut: actualSignOut,
      sendPasswordResetEmail: actualSendPasswordResetEmail,
      connectAuthEmulator: actualConnectAuthEmulator
    };
  } catch (error) {
    console.error('Error importing Firebase Auth SDK:', error);
    // Fallback to stubs if Firebase import fails
    exportedAuth = createServerStubs(true);
  }
} else {
  // For server environments (both regular server and Vercel)
  exportedAuth = createServerStubs(isVercel);
}

// Export all the auth methods
export const {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  getAuth,
  connectAuthEmulator
} = exportedAuth;

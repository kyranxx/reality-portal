/**
 * Firebase Auth Stubs for Server/Build environments
 *
 * This file provides stub implementations for Firebase Auth methods
 * to be used during server rendering and build time.
 *
 * IMPORTANT: This file is specifically designed to be used in build environments
 * and contains no actual Firebase functionality.
 */

// Type definitions
export type Auth = any;
export type User = any;
export type UserCredential = any;
export type AuthProvider = any;
export type AuthError = any;

// Stub class implementations
export class GoogleAuthProvider {
  static credential() {
    return {};
  }
  addScope() {}
  setCustomParameters() {}
}

// Empty function implementations that work in any environment
export const onAuthStateChanged = () => {
  console.log(`Build-time onAuthStateChanged called (no-op)`);
  return () => {}; // Return empty unsubscribe function
};

export const createUserWithEmailAndPassword = async () => {
  console.log(`Build-time createUserWithEmailAndPassword called (no-op)`);
  throw new Error('Authentication operations cannot be performed during build');
};

export const signInWithEmailAndPassword = async () => {
  console.log(`Build-time signInWithEmailAndPassword called (no-op)`);
  throw new Error('Authentication operations cannot be performed during build');
};

export const signOut = async () => {
  console.log(`Build-time signOut called (no-op)`);
  throw new Error('Authentication operations cannot be performed during build');
};

export const signInWithPopup = async () => {
  console.log(`Build-time signInWithPopup called (no-op)`);
  throw new Error('Authentication operations cannot be performed during build');
};

export const sendPasswordResetEmail = async () => {
  console.log(`Build-time sendPasswordResetEmail called (no-op)`);
  throw new Error('Authentication operations cannot be performed during build');
};

export const getAuth = () => {
  console.log(`Build-time getAuth called (no-op)`);
  return {};
};

export const connectAuthEmulator = () => {
  console.log(`Build-time connectAuthEmulator called (no-op)`);
};

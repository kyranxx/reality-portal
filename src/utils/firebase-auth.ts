/**
 * Enhanced Firebase Auth module
 * This file provides a robust compatibility layer for Firebase Auth
 * that works consistently across local development and Vercel deployment
 * 
 * IMPORTANT: This is a simplified version that uses the unified implementation
 */

// Import the unified implementation
import * as unifiedAuth from './firebase-auth-unified';

// Re-export type definitions
export type {
  Auth,
  User,
  UserCredential,
  AuthProvider,
  AuthError
} from './firebase-auth-unified';

// Re-export the unified implementation
export const {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  getAuth,
  connectAuthEmulator
} = unifiedAuth;

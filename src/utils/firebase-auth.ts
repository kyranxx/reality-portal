/**
 * Enhanced Firebase Auth module
 * This file provides a robust compatibility layer for Firebase Auth
 * that works consistently across local development and Vercel deployment
 * 
 * IMPORTANT: This version uses static imports to avoid webpack dynamic import warnings
 */

// Import all three environment-specific implementations
import * as clientAuth from './firebase-auth-client';
import * as serverAuth from './firebase-auth-server';
import * as vercelAuth from './firebase-auth-vercel';

// Re-export type definitions
export type {
  Auth,
  User,
  UserCredential,
  AuthProvider,
  AuthError
} from './firebase-auth-client';

// Determine the runtime environment
const isClient = typeof window !== 'undefined';
const isVercel = typeof process !== 'undefined' && process.env && process.env.VERCEL === '1';

// Select the appropriate implementation based on environment
let authImplementation = isClient 
  ? clientAuth 
  : (isVercel ? vercelAuth : serverAuth);

// Log which environment we're using
console.log(`Firebase Auth using: ${isClient ? 'client' : (isVercel ? 'vercel' : 'server')} implementation`);

// Re-export the appropriate implementation
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
} = authImplementation;

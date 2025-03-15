/**
 * Custom Firebase Auth module
 * This file re-exports types and functions from 'firebase/auth'
 * to ensure compatibility with both local development and Vercel deployment
 */

// Define types for Firebase Auth
// Using any types since the actual types might not be available in all environments
export type Auth = any;
export type User = any;
export type UserCredential = any;
export type AuthProvider = any;
export type AuthError = any;

// Determine if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';

// Import from the appropriate source based on environment
let firebaseAuth: any;

// In a try-catch to handle both client and server-side execution
try {
  if (typeof window !== 'undefined') {
    // Client-side: Always use firebase/auth
    firebaseAuth = require('firebase/auth');
  } else if (isVercel) {
    // Server-side in Vercel: Use our custom vercel compatibility module
    firebaseAuth = require('./firebase-auth-vercel.js');
  } else {
    // Server-side in development: Use firebase/auth
    firebaseAuth = require('firebase/auth');
  }
} catch (error) {
  console.warn('Error importing Firebase Auth:', error);
  // Provide fallback empty implementations
  firebaseAuth = {
    onAuthStateChanged: () => () => {},
    createUserWithEmailAndPassword: async () => ({}),
    signInWithEmailAndPassword: async () => ({}),
    signOut: async () => {},
    GoogleAuthProvider: class {},
    signInWithPopup: async () => ({}),
    sendPasswordResetEmail: async () => {},
    getAuth: () => ({}),
    connectAuthEmulator: () => {},
  };
}

// Re-export functions with proper types
export const onAuthStateChanged = firebaseAuth.onAuthStateChanged;
export const createUserWithEmailAndPassword = firebaseAuth.createUserWithEmailAndPassword;
export const signInWithEmailAndPassword = firebaseAuth.signInWithEmailAndPassword;
export const signOut = firebaseAuth.signOut;
export const GoogleAuthProvider = firebaseAuth.GoogleAuthProvider;
export const signInWithPopup = firebaseAuth.signInWithPopup;
export const sendPasswordResetEmail = firebaseAuth.sendPasswordResetEmail;
export const getAuth = firebaseAuth.getAuth;
export const connectAuthEmulator = firebaseAuth.connectAuthEmulator;

/**
 * Custom Firebase Auth module
 * This file re-exports types and functions from 'firebase/auth' and '@firebase/auth'
 * to ensure compatibility with both local development and Vercel deployment
 */

// Re-export types from firebase/auth
import type {
  Auth as FirebaseAuth,
  User as FirebaseUser,
  UserCredential,
  AuthProvider,
  AuthError
} from 'firebase/auth';

// Re-export functions from firebase/auth for local development
import * as firebaseAuth from 'firebase/auth';

// Define our exported types
export type Auth = FirebaseAuth;
export type User = FirebaseUser;

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

/**
 * Firebase Auth client-side implementation
 * Used in browser environments
 */

// Import the full module to avoid issues with specific exports
import * as firebaseAuthModule from 'firebase/auth';

// Define type aliases for better type safety
export type Auth = any;
export type User = any;
export type UserCredential = any;
export type AuthProvider = any;
export type AuthError = any;

// Create safe wrapper functions with error handling
export const onAuthStateChanged = (...args: any[]) => {
  try {
    return firebaseAuthModule.onAuthStateChanged(...args);
  } catch (error) {
    console.error('Error in onAuthStateChanged:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

export const createUserWithEmailAndPassword = async (...args: any[]) => {
  try {
    return await firebaseAuthModule.createUserWithEmailAndPassword(...args);
  } catch (error) {
    console.error('Error in createUserWithEmailAndPassword:', error);
    throw error;
  }
};

export const signInWithEmailAndPassword = async (...args: any[]) => {
  try {
    return await firebaseAuthModule.signInWithEmailAndPassword(...args);
  } catch (error) {
    console.error('Error in signInWithEmailAndPassword:', error);
    throw error;
  }
};

export const signOut = async (...args: any[]) => {
  try {
    return await firebaseAuthModule.signOut(...args);
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
};

export const GoogleAuthProvider = firebaseAuthModule.GoogleAuthProvider;

export const signInWithPopup = async (...args: any[]) => {
  try {
    return await firebaseAuthModule.signInWithPopup(...args);
  } catch (error) {
    console.error('Error in signInWithPopup:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (...args: any[]) => {
  try {
    return await firebaseAuthModule.sendPasswordResetEmail(...args);
  } catch (error) {
    console.error('Error in sendPasswordResetEmail:', error);
    throw error;
  }
};

export const getAuth = (...args: any[]) => {
  try {
    return firebaseAuthModule.getAuth(...args);
  } catch (error) {
    console.error('Error in getAuth:', error);
    return {};
  }
};

export const connectAuthEmulator = (...args: any[]) => {
  try {
    return firebaseAuthModule.connectAuthEmulator(...args);
  } catch (error) {
    console.error('Error in connectAuthEmulator:', error);
  }
};

// Log initialization
console.log('Initialized firebase-auth-client');

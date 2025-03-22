/**
 * Enhanced Firebase Auth module
 * This file provides a robust compatibility layer for Firebase Auth
 * that works consistently across local development and Vercel deployment
 */

// Define types for Firebase Auth
export type Auth = any;
export type User = any;
export type UserCredential = any;
export type AuthProvider = any;
export type AuthError = any;

// Determine if we're in a Node.js environment
const isNode = typeof window === 'undefined';

// Determine if we're in a Vercel environment
const isVercel = typeof process !== 'undefined' && process.env && process.env.VERCEL === '1';

// Initial fallback implementation
let firebaseAuth: any = {
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

// Try to import Firebase Auth using multiple approaches
try {
  // Client-side approach: Standard Firebase import
  if (!isNode) {
    try {
      // Standard client-side import
      firebaseAuth = require('firebase/auth');
      console.log('Successfully imported firebase/auth on client');
    } catch (clientError) {
      console.error('Error importing firebase/auth on client:', clientError);
    }
  } 
  // Server-side approach: Different depending on environment
  else {
    if (isVercel) {
      try {
        // Use custom vercel compatibility module in Vercel environment
        const moduleSpec = require.resolve('firebase-auth-vercel.js');
        firebaseAuth = require(moduleSpec);
        console.log('Successfully imported firebase-auth-vercel.js in Vercel');
      } catch (error: any) {
        // Fallback to standard import if custom module fails
        console.warn('Failed to import firebase-auth-vercel.js:', error.message || String(error));
        console.warn('Falling back to standard firebase/auth import');
        firebaseAuth = require('firebase/auth');
      }
    } else {
      // Development server-side: Use standard import
      firebaseAuth = require('firebase/auth');
      console.log('Successfully imported firebase/auth on server (development)');
    }
  }
} catch (error: any) {
  console.warn('Error importing Firebase Auth, using fallbacks:', error.message || String(error));
}

// Re-export functions with proper types and error handling
export const onAuthStateChanged = (...args: any[]) => {
  try {
    return firebaseAuth.onAuthStateChanged(...args);
  } catch (error) {
    console.error('Error in onAuthStateChanged:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

export const createUserWithEmailAndPassword = async (...args: any[]) => {
  try {
    return await firebaseAuth.createUserWithEmailAndPassword(...args);
  } catch (error) {
    console.error('Error in createUserWithEmailAndPassword:', error);
    throw error;
  }
};

export const signInWithEmailAndPassword = async (...args: any[]) => {
  try {
    return await firebaseAuth.signInWithEmailAndPassword(...args);
  } catch (error) {
    console.error('Error in signInWithEmailAndPassword:', error);
    throw error;
  }
};

export const signOut = async (...args: any[]) => {
  try {
    return await firebaseAuth.signOut(...args);
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
};

export const GoogleAuthProvider = firebaseAuth.GoogleAuthProvider;

export const signInWithPopup = async (...args: any[]) => {
  try {
    return await firebaseAuth.signInWithPopup(...args);
  } catch (error) {
    console.error('Error in signInWithPopup:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (...args: any[]) => {
  try {
    return await firebaseAuth.sendPasswordResetEmail(...args);
  } catch (error) {
    console.error('Error in sendPasswordResetEmail:', error);
    throw error;
  }
};

export const getAuth = (...args: any[]) => {
  try {
    return firebaseAuth.getAuth(...args);
  } catch (error) {
    console.error('Error in getAuth:', error);
    return {};
  }
};

export const connectAuthEmulator = (...args: any[]) => {
  try {
    return firebaseAuth.connectAuthEmulator(...args);
  } catch (error) {
    console.error('Error in connectAuthEmulator:', error);
  }
};

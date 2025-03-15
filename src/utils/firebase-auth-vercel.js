/**
 * Firebase Auth module for Vercel deployment
 * This file provides compatibility with Firebase v10.7.0 in the Vercel environment
 */

// Import all functions from firebase/auth
const firebaseAuth = require('firebase/auth');

// Explicitly re-export each function to ensure they're available
module.exports = {
  // Auth instance functions
  getAuth: firebaseAuth.getAuth,
  connectAuthEmulator: firebaseAuth.connectAuthEmulator,
  
  // Authentication state functions
  onAuthStateChanged: firebaseAuth.onAuthStateChanged,
  
  // Email/password authentication
  createUserWithEmailAndPassword: firebaseAuth.createUserWithEmailAndPassword,
  signInWithEmailAndPassword: firebaseAuth.signInWithEmailAndPassword,
  sendPasswordResetEmail: firebaseAuth.sendPasswordResetEmail,
  
  // Sign out
  signOut: firebaseAuth.signOut,
  
  // OAuth providers
  GoogleAuthProvider: firebaseAuth.GoogleAuthProvider,
  signInWithPopup: firebaseAuth.signInWithPopup,
  
  // Re-export everything else
  ...firebaseAuth
};

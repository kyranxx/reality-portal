'use client';

import { createContext, useContext, useEffect, useState } from 'react';
// Import directly from firebase/auth in client components
import * as firebaseAuthStubs from '../utils/firebase-auth-unified';
import { auth, isFirebaseConfigured } from './firebase';

// Import directly from firebase/auth when in client context
// This ensures we get the real implementation at runtime
let createUserWithEmailAndPassword: any;
let signInWithEmailAndPassword: any;
let firebaseSignOut: any; // Renamed to avoid collision with the signOut method
let onAuthStateChanged: any;
let GoogleAuthProvider: any;
let signInWithPopup: any;
let sendPasswordResetEmail: any;

// Check if we're in a client context (this is a client component)
if (typeof window !== 'undefined') {
  try {
    // Direct import will be used at runtime in browser
    const firebaseAuth = require('firebase/auth');
    
    // Use the real Firebase Auth methods
    createUserWithEmailAndPassword = firebaseAuth.createUserWithEmailAndPassword;
    signInWithEmailAndPassword = firebaseAuth.signInWithEmailAndPassword;
    firebaseSignOut = firebaseAuth.signOut; // Renamed to avoid collision
    onAuthStateChanged = firebaseAuth.onAuthStateChanged;
    GoogleAuthProvider = firebaseAuth.GoogleAuthProvider;
    signInWithPopup = firebaseAuth.signInWithPopup;
    sendPasswordResetEmail = firebaseAuth.sendPasswordResetEmail;
  } catch (error) {
    console.error('Failed to load Firebase Auth in FirebaseAuthContext:', error);
    // Fallback to stubs if real import fails
    createUserWithEmailAndPassword = firebaseAuthStubs.createUserWithEmailAndPassword;
    signInWithEmailAndPassword = firebaseAuthStubs.signInWithEmailAndPassword;
    firebaseSignOut = firebaseAuthStubs.signOut; // Renamed to avoid collision
    onAuthStateChanged = firebaseAuthStubs.onAuthStateChanged;
    GoogleAuthProvider = firebaseAuthStubs.GoogleAuthProvider;
    signInWithPopup = firebaseAuthStubs.signInWithPopup;
    sendPasswordResetEmail = firebaseAuthStubs.sendPasswordResetEmail;
  }
} else {
  // Use stubs for SSR (should never execute in a use client component)
  createUserWithEmailAndPassword = firebaseAuthStubs.createUserWithEmailAndPassword;
  signInWithEmailAndPassword = firebaseAuthStubs.signInWithEmailAndPassword;
  firebaseSignOut = firebaseAuthStubs.signOut; // Renamed to avoid collision
  onAuthStateChanged = firebaseAuthStubs.onAuthStateChanged;
  GoogleAuthProvider = firebaseAuthStubs.GoogleAuthProvider;
  signInWithPopup = firebaseAuthStubs.signInWithPopup;
  sendPasswordResetEmail = firebaseAuthStubs.sendPasswordResetEmail;
}

// Define types for Firebase Auth
type User = any;
type Auth = any;

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  error: string | null;
};

// Create a default context value to prevent the "useAuth must be used within a FirebaseAuthProvider" error
// during server-side rendering
const defaultContextValue: AuthContextType = {
  user: null,
  isLoading: true,
  signUp: async () => { },
  signIn: async () => { },
  signInWithGoogle: async () => { },
  signOut: async () => { },
  resetPassword: async () => { },
  error: null,
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

// Check if we're in build time (set by prebuild.js)
const isBuildTime = process.env.NEXT_PUBLIC_IS_BUILD_TIME === 'true';

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip Firebase initialization if not configured or not on client
    if (!isClient) {
      setIsLoading(false);
      return () => {};
    }

    if (!isFirebaseConfigured || !auth) {
      console.warn('Firebase is not configured. Authentication features will be disabled.');
      setIsLoading(false);
      return () => {};
    }

    let unsubscribe: () => void;
    
    try {
      // Listen for auth state changes with better error handling
      unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
        setUser(currentUser);
        setIsLoading(false);
      }, (error: any) => {
        console.error('Auth state change error:', error);
        setError('Authentication error: ' + (error.message || 'Unknown error'));
        setIsLoading(false);
      });
    } catch (err: any) {
      console.error('Failed to initialize Firebase auth listener:', err);
      setError('Failed to initialize authentication system');
      setIsLoading(false);
      return () => {};
    }

    return () => {
      try {
        unsubscribe();
      } catch (err) {
        console.error('Error unsubscribing from auth state:', err);
      }
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    if (!isClient) return;

    if (!isFirebaseConfigured || !auth) {
      setError('Authentication service is not configured');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing up:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isClient) return;

    if (!isFirebaseConfigured || !auth) {
      setError('Authentication service is not configured');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing in:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!isClient) return;

    if (!isFirebaseConfigured || !auth) {
      setError('Authentication service is not configured');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const provider = new GoogleAuthProvider();
      // Add scopes for better user experience
      provider.addScope('profile');
      provider.addScope('email');
      
      // Set custom parameters for the auth provider
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      await signInWithPopup(auth, provider).catch((error: any) => {
        // Handle specific popup errors
        if (error.code === 'auth/popup-blocked') {
          setError('Popup was blocked by your browser. Please allow popups for this site.');
        } else if (error.code === 'auth/popup-closed-by-user') {
          setError('Authentication was cancelled. Please try again.');
        } else {
          throw error; // Re-throw other errors to be caught by the outer catch
        }
      });
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      setError(error.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (!isClient) return;

    if (!isFirebaseConfigured || !auth) {
      setError('Authentication service is not configured');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await firebaseSignOut(auth);
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing out:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (!isClient) return;

    if (!isFirebaseConfigured || !auth) {
      setError('Authentication service is not configured');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      setError(error.message);
      console.error('Error resetting password:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  // Check if we're running on the client side
  const isClientSide = typeof window !== 'undefined';
  
  // During SSR or build time, return the default context to prevent errors
  if (!isClientSide || isBuildTime) {
    return defaultContextValue;
  }
  
  const context = useContext(AuthContext);
  
  if (!context) {
    console.warn('useAuth must be used within an AuthProvider');
    return defaultContextValue;
  }
  
  return context;
}

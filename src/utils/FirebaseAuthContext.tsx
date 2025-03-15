'use client';

import { createContext, useContext, useEffect, useState } from 'react';
// Import from firebase/auth with any types to suppress TypeScript errors
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from '../utils/firebase-auth';

// Define types for Firebase Auth
type User = any;
type Auth = any;
import { auth, isFirebaseConfigured } from './firebase';

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
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      console.warn('Firebase is not configured. Authentication features will be disabled.');
      setIsLoading(false);
      return;
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      setUser(currentUser);
      setIsLoading(false);
    }, (error: any) => {
      console.error('Auth state change error:', error);
      setError(error.message);
      setIsLoading(false);
    });

    return () => unsubscribe();
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
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing in with Google:', error.message);
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

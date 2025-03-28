'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseService from './firebase-service';

// Define types for Firebase Auth
type User = any;

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

// Create a default context value
const defaultContextValue: AuthContextType = {
  user: null,
  isLoading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  error: null,
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Early return if not in client environment
    if (!isClient) {
      setIsLoading(false);
      return () => {};
    }

    // Wait for Firebase Auth to be initialized, then set up auth state listener
    const initAuth = async () => {
      try {
        await firebaseService.waitForAuth();

        // Set initial user state
        setUser(firebaseService.getCurrentUser());
        setIsLoading(false);

        // Subscribe to auth state changes
        return firebaseService.onAuthStateChange(currentUser => {
          setUser(currentUser);
          setIsLoading(false);
        });
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        setError('Authentication system unavailable');
        setIsLoading(false);
        return () => {};
      }
    };

    // Initialize auth and store unsubscribe function
    const unsubscribePromise = initAuth();

    // Clean up function
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    if (!isClient) return;

    try {
      setIsLoading(true);
      setError(null);
      await firebaseService.createUserWithEmailPassword(email, password);
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing up:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isClient) return;

    try {
      setIsLoading(true);
      setError(null);
      await firebaseService.signInWithEmailPassword(email, password);
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing in:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!isClient) return;

    try {
      setIsLoading(true);
      setError(null);
      await firebaseService.signInWithGoogle();
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing in with Google:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (!isClient) return;

    try {
      setIsLoading(true);
      setError(null);
      await firebaseService.signOut();
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing out:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (!isClient) return;

    try {
      setIsLoading(true);
      setError(null);
      // TODO: Add resetPassword method to firebase-service
      setError('Password reset functionality not implemented yet');
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
  const context = useContext(AuthContext);

  if (!context) {
    console.warn('useAuth must be used within a FirebaseAuthProvider');
    return defaultContextValue;
  }

  return context;
}

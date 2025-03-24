'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth, isFirebaseConfigured } from './firebase';

// Import Firebase auth safely
// We use a dynamic import to ensure this runs only in the browser
let firebaseAuth: any = null;

// Initialize Firebase auth functions
let createUserWithEmailAndPassword: any;
let signInWithEmailAndPassword: any;
let firebaseSignOut: any;
let onAuthStateChanged: any;
let GoogleAuthProvider: any;
let signInWithPopup: any;
let sendPasswordResetEmail: any;

// Safe initialization function for Firebase Auth
const initializeAuth = () => {
  // Only run in client environment
  if (typeof window === 'undefined') return false;

  try {
    // Import synchronously since we're in a client component
    firebaseAuth = require('firebase/auth');
    
    // Store function references
    createUserWithEmailAndPassword = firebaseAuth.createUserWithEmailAndPassword;
    signInWithEmailAndPassword = firebaseAuth.signInWithEmailAndPassword;
    firebaseSignOut = firebaseAuth.signOut;
    onAuthStateChanged = firebaseAuth.onAuthStateChanged;
    GoogleAuthProvider = firebaseAuth.GoogleAuthProvider;
    signInWithPopup = firebaseAuth.signInWithPopup;
    sendPasswordResetEmail = firebaseAuth.sendPasswordResetEmail;
    
    return true;
  } catch (error) {
    console.error('Failed to initialize Firebase Auth:', error);
    return false;
  }
};

// Initialize auth in client environments
const isAuthInitialized = initializeAuth();

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
    // Early return if not in client environment
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return () => {};
    }

    // Check if Firebase is configured
    if (!isFirebaseConfigured) {
      console.warn('Firebase is not configured. Authentication features will be disabled.');
      setIsLoading(false);
      return () => {};
    }

    // Check if auth is available
    if (!auth) {
      console.error('Firebase auth object is not available');
      setError('Authentication system unavailable');
      setIsLoading(false);
      return () => {};
    }

    // Check if auth initialization was successful
    if (!isAuthInitialized) {
      console.error('Firebase Auth failed to initialize');
      setError('Authentication system failed to initialize');
      setIsLoading(false);
      return () => {};
    }

    let unsubscribe: () => void = () => {};
    
    try {
      // Setup auth state listener with retry mechanism
      const setupAuthListener = () => {
        try {
          // Use the imported onAuthStateChanged function (safer approach)
          unsubscribe = onAuthStateChanged(
            auth,
            (currentUser: any) => {
              setUser(currentUser);
              setIsLoading(false);
              console.log('Auth state changed:', currentUser ? 'User logged in' : 'No user');
            },
            (error: any) => {
              console.error('Auth state change error:', error);
              setError('Authentication error: ' + (error.message || 'Unknown error'));
              setIsLoading(false);
            }
          );
          
          console.log('Auth listener registered successfully');
          return true;
        } catch (listenerError) {
          console.error('Error setting up auth listener:', listenerError);
          return false;
        }
      };
      
      // Try to set up the listener, with a fallback approach if it fails
      if (!setupAuthListener() && auth) {
        console.warn('Falling back to alternative auth approach');
        // Wait a moment and try again with a direct approach
        setTimeout(() => {
          try {
            if (auth && typeof auth.onAuthStateChanged === 'function') {
              unsubscribe = auth.onAuthStateChanged(
                (currentUser: any) => {
                  setUser(currentUser);
                  setIsLoading(false);
                },
                (error: any) => {
                  console.error('Auth state change error (fallback):', error);
                  setError('Authentication error: ' + (error.message || 'Unknown error'));
                  setIsLoading(false);
                }
              );
            } else {
              setError('Authentication system unavailable');
              setIsLoading(false);
            }
          } catch (fallbackError) {
            console.error('Even fallback auth approach failed:', fallbackError);
            setError('Authentication system unavailable');
            setIsLoading(false);
          }
        }, 100);
      }
    } catch (err: any) {
      console.error('Failed to initialize Firebase auth listener:', err);
      setError('Failed to initialize authentication system');
      setIsLoading(false);
    }

    // Clean up function
    return () => {
      try {
        unsubscribe();
        console.log('Auth listener unsubscribed');
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

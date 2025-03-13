'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  Auth
} from 'firebase/auth';
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip Firebase initialization if not configured or not on client
    if (!isFirebaseConfigured || !isClient || !auth) {
      console.warn('Firebase is not configured or not on client. Authentication features will be disabled.');
      setIsLoading(false);
      return;
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      setError(error.message);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !isClient || !auth) {
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
    if (!isFirebaseConfigured || !isClient || !auth) {
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
    if (!isFirebaseConfigured || !isClient || !auth) {
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
    if (!isFirebaseConfigured || !isClient || !auth) {
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
    if (!isFirebaseConfigured || !isClient || !auth) {
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
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseAuthProvider');
  }
  return context;
}

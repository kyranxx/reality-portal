'use client';

/**
 * Firebase Auth Context
 * 
 * This module provides a React context for Firebase authentication with hooks
 * for components to access the current user and auth functions.
 */

import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { 
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User
} from './index';
import { ADMIN_EMAILS } from './config';

// Add cookie handling
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === 'undefined') return;
  
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict; Secure`;
};

const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure`;
};

// Auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  // Alias for loading to maintain compatibility with existing components
  isLoading: boolean;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isAdmin: false,
  signIn: async () => {},
  signUp: async () => {},
  resetPassword: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
  isLoading: true // Alias for loading property
});

// Auth provider props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    // Handle auth state changes
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
        
        // Set user cookie for server-side auth
        setCookie('auth-token', 'true');
        
        // Check if user is admin
        setIsAdmin(ADMIN_EMAILS.includes(authUser.email?.toLowerCase() || ''));
      } else {
        // User is signed out
        setUser(null);
        setIsAdmin(false);
        
        // Remove auth cookie
        deleteCookie('auth-token');
      }
      
      setLoading(false);
    });

    // Clean up the listener
    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(error.message || 'Sign in failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const handleSignUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's profile with the provided name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
    } catch (error: any) {
      setError(error.message || 'Sign up failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      setError(error.message || 'Password reset failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await signOut(auth);
    } catch (error: any) {
      setError(error.message || 'Sign out failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const handleUpdateProfile = async (name: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (user) {
        await updateProfile(user, { displayName: name });
        
        // Update local user state to reflect the changes
        // Need to recreate user object rather than trying to modify it directly
        setUser(prevUser => {
          if (prevUser) {
            // Force refresh user to get updated profile
            return { ...prevUser, displayName: name };
          }
          return prevUser;
        });
      } else {
        throw new Error('No user is signed in');
      }
    } catch (error: any) {
      setError(error.message || 'Profile update failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create context value
  const contextValue = useMemo(
    () => ({
      user,
      loading,
      error,
      isAdmin,
      signIn: handleSignIn,
      signUp: handleSignUp,
      resetPassword: handleResetPassword,
      signOut: handleSignOut,
      updateProfile: handleUpdateProfile,
      isLoading: loading // Alias for loading property to maintain compatibility
    }),
    [user, loading, error, isAdmin]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;

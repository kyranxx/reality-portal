'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip Supabase initialization if not configured
    if (!isSupabaseConfigured) {
      console.warn('Supabase is not configured. Authentication features will be disabled.');
      setIsLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error.message);
          setError(error.message);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (err: any) {
        console.error('Failed to get session:', err.message);
        setError('Authentication service unavailable');
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const { data } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      );
      
      subscription = data.subscription;
    } catch (err: any) {
      console.error('Failed to subscribe to auth changes:', err.message);
      setIsLoading(false);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      setError('Authentication service is not configured');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing up:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      setError('Authentication service is not configured');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing in:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setError('Authentication service is not configured');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing out:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

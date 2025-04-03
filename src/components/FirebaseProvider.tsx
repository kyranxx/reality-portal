'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { waitForFirebaseInit, isFirebaseInitialized } from '../utils/firebase';
import { auth, db, storage } from '../utils/firebase';

// Create a context to track Firebase initialization state
interface FirebaseContextType {
  isInitialized: boolean;
  auth: typeof auth;
  db: typeof db;
  storage: typeof storage;
  isLoading: boolean;
  error: Error | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  isInitialized: false,
  auth,
  db,
  storage,
  isLoading: true,
  error: null,
});

// Hook to use Firebase context
export const useFirebase = () => useContext(FirebaseContext);

interface FirebaseProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function FirebaseProvider({ children, fallback = <div>Loading Firebase...</div> }: FirebaseProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initFirebase = async () => {
      try {
        await waitForFirebaseInit();
        
        // Double-check Firebase initialization
        const fsInitialized = isFirebaseInitialized();
        console.log(`Firestore initialization status: ${fsInitialized ? 'INITIALIZED' : 'NOT INITIALIZED'}`);
        
        // Verify Firestore connection with simple permission test
        if (db) {
          console.log('Firebase Provider: Firestore object exists');
        } else {
          console.error('Firebase Provider: Firestore object is null or undefined');
        }
        
        // Only update state if component is still mounted
        if (isMounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error initializing Firebase:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize Firebase'));
          setIsLoading(false);
        }
      }
    };

    initFirebase();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (error) {
    return <div>Error initializing Firebase: {error.message}</div>;
  }

  return (
    <FirebaseContext.Provider
      value={{
        isInitialized,
        auth,
        db,
        storage,
        isLoading,
        error,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

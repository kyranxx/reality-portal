/**
 * Firestore utilities for safer data operations
 * 
 * This file provides utilities to make Firestore operations more robust,
 * with built-in auth state verification, error handling, and retry mechanisms.
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  QueryConstraint,
  DocumentData,
  DocumentReference,
  WithFieldValue,
  SetOptions
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { useAuthErrorHandler } from '../components/AuthErrorBoundary';

// Maximum number of retries for Firestore operations
const MAX_RETRIES = 3;

// Error class for Firestore operations
export class FirestoreError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'FirestoreError';
    this.code = code;
  }
}

/**
 * Check if user is authenticated before Firestore operations
 * @returns true if authenticated, throws error if not
 */
export function verifyAuthBeforeDbOperation(): boolean {
  if (!auth || !auth.currentUser) {
    throw new FirestoreError(
      'You must be logged in to perform this operation',
      'auth/not-authenticated'
    );
  }
  return true;
}

/**
 * Safely get a document with authentication check and error handling
 */
export async function safeGetDoc<T>(
  collectionName: string, 
  docId: string,
  requireAuth = true
): Promise<T & { id: string } | null> {
  if (requireAuth) {
    verifyAuthBeforeDbOperation();
  }

  if (!db) {
    throw new FirestoreError('Database is not initialized');
  }

  let attempt = 0;
  let lastError: any = null;

  while (attempt < MAX_RETRIES) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
      } else {
        return null;
      }
    } catch (error: any) {
      lastError = error;
      
      // Check if this is a permission error
      const isPermissionError = error.code === 'permission-denied' || error.message?.includes('permission');
      
      if (isPermissionError && requireAuth) {
        // Only retry permission errors if we required auth
        console.error(`Permission error on attempt ${attempt + 1} for ${collectionName}/${docId}`);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
        attempt++;
      } else {
        // For other errors, don't retry
        throw new FirestoreError(
          error.message || 'Error getting document',
          error.code
        );
      }
    }
  }

  // If we've exhausted our retries
  throw new FirestoreError(
    `Failed to get document after ${MAX_RETRIES} attempts: ${lastError?.message || 'unknown error'}`,
    lastError?.code
  );
}

/**
 * Safely query documents with authentication check and error handling
 */
export async function safeGetDocs<T>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = [],
  requireAuth = true
): Promise<(T & { id: string })[]> {
  if (requireAuth) {
    verifyAuthBeforeDbOperation();
  }

  if (!db) {
    throw new FirestoreError('Database is not initialized');
  }

  let attempt = 0;
  let lastError: any = null;

  while (attempt < MAX_RETRIES) {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (T & { id: string })[];
    } catch (error: any) {
      lastError = error;
      
      // Check if this is a permission error
      const isPermissionError = error.code === 'permission-denied' || error.message?.includes('permission');
      
      if (isPermissionError && requireAuth) {
        // Only retry permission errors if we required auth
        console.error(`Permission error on attempt ${attempt + 1} for ${collectionName} query`);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
        attempt++;
      } else {
        // For other errors, don't retry
        throw new FirestoreError(
          error.message || 'Error querying documents',
          error.code
        );
      }
    }
  }

  // If we've exhausted our retries
  throw new FirestoreError(
    `Failed to query documents after ${MAX_RETRIES} attempts: ${lastError?.message || 'unknown error'}`,
    lastError?.code
  );
}

/**
 * Safely set a document with authentication check and error handling
 */
export async function safeSetDoc<T extends DocumentData>(
  collectionName: string,
  docId: string | null,
  data: WithFieldValue<T>,
  options?: SetOptions
): Promise<string> {
  verifyAuthBeforeDbOperation();

  if (!db) {
    throw new FirestoreError('Database is not initialized');
  }

  let attempt = 0;
  let lastError: any = null;
  let docIdToUse = docId;

  // If no document ID is provided, generate one
  if (!docIdToUse) {
    // Create a new doc reference and get its ID without type constraints
    const newDocRef = doc(collection(db, collectionName));
    docIdToUse = newDocRef.id;
  }

  while (attempt < MAX_RETRIES) {
    try {
      // Use a type assertion that avoids the generic type constraint issue
      const docRef = doc(db, collectionName, docIdToUse as string);
      
      // Only pass options if defined
      if (options !== undefined) {
        await setDoc(docRef, data as any, options);
      } else {
        await setDoc(docRef, data as any);
      }
      return docIdToUse as string;
    } catch (error: any) {
      lastError = error;
      
      // Check if this is a permission error
      const isPermissionError = error.code === 'permission-denied' || error.message?.includes('permission');
      
      if (isPermissionError) {
        console.error(`Permission error on attempt ${attempt + 1} for setting ${collectionName}/${docIdToUse}`);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
        attempt++;
      } else {
        // For other errors, don't retry
        throw new FirestoreError(
          error.message || 'Error setting document',
          error.code
        );
      }
    }
  }

  // If we've exhausted our retries
  throw new FirestoreError(
    `Failed to set document after ${MAX_RETRIES} attempts: ${lastError?.message || 'unknown error'}`,
    lastError?.code
  );
}

/**
 * Safely update a document with authentication check and error handling
 */
export async function safeUpdateDoc<T>(
  collectionName: string,
  docId: string,
  data: WithFieldValue<T>
): Promise<void> {
  verifyAuthBeforeDbOperation();

  if (!db) {
    throw new FirestoreError('Database is not initialized');
  }

  let attempt = 0;
  let lastError: any = null;

  while (attempt < MAX_RETRIES) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data as any);
      return;
    } catch (error: any) {
      lastError = error;
      
      // Check if this is a permission error
      const isPermissionError = error.code === 'permission-denied' || error.message?.includes('permission');
      
      if (isPermissionError) {
        console.error(`Permission error on attempt ${attempt + 1} for updating ${collectionName}/${docId}`);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
        attempt++;
      } else {
        // For other errors, don't retry
        throw new FirestoreError(
          error.message || 'Error updating document',
          error.code
        );
      }
    }
  }

  // If we've exhausted our retries
  throw new FirestoreError(
    `Failed to update document after ${MAX_RETRIES} attempts: ${lastError?.message || 'unknown error'}`,
    lastError?.code
  );
}

/**
 * Safely delete a document with authentication check and error handling
 */
export async function safeDeleteDoc(
  collectionName: string,
  docId: string
): Promise<void> {
  verifyAuthBeforeDbOperation();

  if (!db) {
    throw new FirestoreError('Database is not initialized');
  }

  let attempt = 0;
  let lastError: any = null;

  while (attempt < MAX_RETRIES) {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return;
    } catch (error: any) {
      lastError = error;
      
      // Check if this is a permission error
      const isPermissionError = error.code === 'permission-denied' || error.message?.includes('permission');
      
      if (isPermissionError) {
        console.error(`Permission error on attempt ${attempt + 1} for deleting ${collectionName}/${docId}`);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
        attempt++;
      } else {
        // For other errors, don't retry
        throw new FirestoreError(
          error.message || 'Error deleting document',
          error.code
        );
      }
    }
  }

  // If we've exhausted our retries
  throw new FirestoreError(
    `Failed to delete document after ${MAX_RETRIES} attempts: ${lastError?.message || 'unknown error'}`,
    lastError?.code
  );
}

/**
 * React hook for Firestore error handling
 */
export function useFirestoreErrorHandler() {
  const { reportAuthError } = useAuthErrorHandler();
  
  return {
    handleFirestoreError: (error: any) => {
      console.error('Firestore operation error:', error);
      
      if (error.code === 'permission-denied' || error.message?.includes('permission')) {
        // If this is a permission error, it might be auth-related
        reportAuthError(new Error('Firebase permission error: ' + error.message));
      }
      
      // Return the error message for UI display
      return error.message || 'An error occurred with the database';
    }
  };
}

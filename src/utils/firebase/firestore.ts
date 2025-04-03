/**
 * Firestore Module
 * 
 * This module provides a unified interface for Firestore operations
 * with proper error handling and type safety.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryDocumentSnapshot,
  serverTimestamp,
  Timestamp,
  CollectionReference,
  QueryConstraint,
  DocumentReference,
  WithFieldValue,
  SetOptions,
  setDoc
} from 'firebase/firestore';
import { db } from './index';
import { isClient } from './config';
import { Property, User, Message, Favorite } from './index';

// Error class for Firestore operations
export class FirestoreError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'FirestoreError';
    this.code = code;
  }
}

// Convert Firestore timestamp to Date
export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

// Convert Firestore document to Property
export const convertPropertyDoc = (doc: QueryDocumentSnapshot<DocumentData>): Property => {
  const data = doc.data();
  return {
    id: doc.id,
    createdAt: data.createdAt ? timestampToDate(data.createdAt) : new Date(),
    title: data.title,
    description: data.description,
    price: data.price,
    location: data.location,
    area: data.area,
    rooms: data.rooms,
    propertyType: data.propertyType,
    userId: data.userId,
    images: data.images || [],
    isFeatured: data.isFeatured || false,
    isNew: data.isNew || false,
    bathrooms: data.bathrooms,
    landSize: data.landSize,
    features: data.features || [],
    contactName: data.contactName,
    contactPhone: data.contactPhone,
    contactEmail: data.contactEmail,
    contactVisibility: data.contactVisibility
  };
};

// Helper function to check if Firestore is available
const checkFirestore = () => {
  if (!isClient || !db) {
    throw new FirestoreError(
      'Firestore is not available. This operation can only be performed on the client side.',
      'unavailable'
    );
  }
};

// Maximum number of retries for Firestore operations
const MAX_RETRIES = 3;

// Get a document with error handling and retries
export async function safeGetDoc<T>(
  collectionName: string,
  docId: string,
  requireAuth = true
): Promise<(T & { id: string }) | null> {
  checkFirestore();

  let attempt = 0;
  let lastError: any = null;

  while (attempt < MAX_RETRIES) {
    try {
      if (!db) throw new FirestoreError('Database is not initialized');
      
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
      } else {
        return null;
      }
    } catch (error: any) {
      lastError = error;
      attempt++;
      
      // Brief delay before retry
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
      }
    }
  }

  throw new FirestoreError(
    `Failed to get document after ${MAX_RETRIES} attempts: ${lastError?.message || 'unknown error'}`,
    lastError?.code || 'unknown-error'
  );
}

// Query documents with error handling and retries
export async function safeGetDocs<T>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = []
): Promise<(T & { id: string })[]> {
  checkFirestore();

  let attempt = 0;
  let lastError: any = null;

  while (attempt < MAX_RETRIES) {
    try {
      if (!db) throw new FirestoreError('Database is not initialized');
      
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as (T & { id: string })[];
    } catch (error: any) {
      lastError = error;
      attempt++;
      
      // Brief delay before retry
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
      }
    }
  }

  throw new FirestoreError(
    `Failed to query documents after ${MAX_RETRIES} attempts: ${lastError?.message || 'unknown error'}`,
    lastError?.code || 'unknown-error'
  );
}

// Add a document with error handling and retries
export async function safeAddDoc<T extends DocumentData>(
  collectionName: string,
  data: WithFieldValue<T>
): Promise<string> {
  checkFirestore();

  let attempt = 0;
  let lastError: any = null;

  // Add server timestamp if not provided
  if (!data.createdAt) {
    data = {
      ...data,
      createdAt: serverTimestamp()
    };
  }

  while (attempt < MAX_RETRIES) {
    try {
      if (!db) throw new FirestoreError('Database is not initialized');
      
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, data as any);
      return docRef.id;
    } catch (error: any) {
      lastError = error;
      attempt++;
      
      // Brief delay before retry
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
      }
    }
  }

  throw new FirestoreError(
    `Failed to add document after ${MAX_RETRIES} attempts: ${lastError?.message || 'unknown error'}`,
    lastError?.code || 'unknown-error'
  );
}

// Set a document with error handling and retries
export async function safeSetDoc<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: WithFieldValue<T>,
  options?: SetOptions
): Promise<void> {
  checkFirestore();

  let attempt = 0;
  let lastError: any = null;

  while (attempt < MAX_RETRIES) {
    try {
      if (!db) throw new FirestoreError('Database is not initialized');
      
      const docRef = doc(db, collectionName, docId);
      if (options) {
        await setDoc(docRef, data as any, options);
      } else {
        await setDoc(docRef, data as any);
      }
      return;
    } catch (error: any) {
      lastError = error;
      attempt++;
      
      // Brief delay before retry
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
      }
    }
  }

  throw new FirestoreError(
    `Failed to set document after ${MAX_RETRIES} attempts: ${lastError?.message || 'unknown error'}`,
    lastError?.code || 'unknown-error'
  );
}

// Update a document with error handling and retries
export async function safeUpdateDoc<T>(
  collectionName: string,
  docId: string,
  data: WithFieldValue<T>
): Promise<void> {
  checkFirestore();

  let attempt = 0;
  let lastError: any = null;

  while (attempt < MAX_RETRIES) {
    try {
      if (!db) throw new FirestoreError('Database is not initialized');
      
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data as any);
      return;
    } catch (error: any) {
      lastError = error;
      attempt++;
      
      // Brief delay before retry
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
      }
    }
  }

  throw new FirestoreError(
    `Failed to update document after ${MAX_RETRIES} attempts: ${lastError?.message || 'unknown error'}`,
    lastError?.code || 'unknown-error'
  );
}

// Delete a document with error handling and retries
export async function safeDeleteDoc(
  collectionName: string,
  docId: string
): Promise<void> {
  checkFirestore();

  let attempt = 0;
  let lastError: any = null;

  while (attempt < MAX_RETRIES) {
    try {
      if (!db) throw new FirestoreError('Database is not initialized');
      
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return;
    } catch (error: any) {
      lastError = error;
      attempt++;
      
      // Brief delay before retry
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
      }
    }
  }

  throw new FirestoreError(
    `Failed to delete document after ${MAX_RETRIES} attempts: ${lastError?.message || 'unknown error'}`,
    lastError?.code || 'unknown-error'
  );
}

// Helper Functions for Properties Collection

// Get all properties
export const getAllProperties = async (): Promise<Property[]> => {
  return safeGetDocs<Property>('properties');
};

// Get featured properties
export const getFeaturedProperties = async (limitCount = 6): Promise<Property[]> => {
  return safeGetDocs<Property>('properties', [
    where('isFeatured', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  ]);
};

// Get new properties
export const getNewProperties = async (limitCount = 3): Promise<Property[]> => {
  return safeGetDocs<Property>('properties', [
    where('isNew', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  ]);
};

// Get property by ID
export const getPropertyById = async (id: string): Promise<Property | null> => {
  return safeGetDoc<Property>('properties', id);
};

// Get properties by type
export const getPropertiesByType = async (type: string): Promise<Property[]> => {
  return safeGetDocs<Property>('properties', [
    where('propertyType', '==', type),
    orderBy('createdAt', 'desc')
  ]);
};

// Get properties by user ID
export const getPropertiesByUserId = async (userId: string): Promise<Property[]> => {
  return safeGetDocs<Property>('properties', [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ]);
};

// Add a new property
export const addProperty = async (
  property: Omit<Property, 'id' | 'createdAt'>
): Promise<string> => {
  return safeAddDoc<Omit<Property, 'id'>>('properties', {
    ...property,
    createdAt: serverTimestamp() as any
  });
};

// Update a property
export const updateProperty = async (id: string, property: Partial<Property>): Promise<void> => {
  // Don't add updatedAt as it's not in the Property interface
  return safeUpdateDoc<Partial<Property>>('properties', id, property);
};

// Delete a property
export const deleteProperty = async (id: string): Promise<void> => {
  return safeDeleteDoc('properties', id);
};

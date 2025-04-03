/**
 * Fix Firebase Utility Redundancies
 * 
 * This script consolidates various Firebase utility files into a single, modular
 * implementation in src/utils/firebase/ directory. It addresses:
 * 
 * 1. Multiple Firebase initialization mechanisms
 * 2. Multiple Firestore utility implementations
 * 3. Redundant Firebase Auth contexts
 */

const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const firebaseDir = path.join(rootDir, 'src', 'utils', 'firebase');
const backupDir = path.join(rootDir, 'backups', 'firebase');

// Source files to consolidate
const sourceFiles = {
  firebase: path.join(rootDir, 'src', 'utils', 'firebase.ts'),
  firebaseInitGuard: path.join(rootDir, 'src', 'utils', 'firebase-init-guard.ts'),
  firebaseAuthUnified: path.join(rootDir, 'src', 'utils', 'firebase-auth-unified.ts'),
  firebaseAuthStub: path.join(rootDir, 'src', 'utils', 'firebase-auth-stub.ts'),
  firebaseConnectionMonitor: path.join(rootDir, 'src', 'utils', 'firebase-connection-monitor.ts'),
  firebaseService: path.join(rootDir, 'src', 'utils', 'firebase-service.ts'),
  firestore: path.join(rootDir, 'src', 'utils', 'firestore.ts'),
  firestoreUtils: path.join(rootDir, 'src', 'utils', 'firestore-utils.ts'),
  firestoreErrorHandler: path.join(rootDir, 'src', 'utils', 'firestore-error-handler.ts'),
  authContext: path.join(rootDir, 'src', 'utils', 'FirebaseAuthContext.tsx'),
  authContextNew: path.join(rootDir, 'src', 'utils', 'FirebaseAuthContext-new.tsx')
};

// Create directories if they don't exist
if (!fs.existsSync(firebaseDir)) {
  fs.mkdirSync(firebaseDir, { recursive: true });
}

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

console.log('Firebase Utilities Consolidation');
console.log('-------------------------------');

// Check if source files exist
let missingFiles = false;
for (const [name, filePath] of Object.entries(sourceFiles)) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ ${name} not found at ${filePath}`);
    missingFiles = true;
  }
}

if (missingFiles) {
  console.error('Some source files are missing. Please check paths.');
  process.exit(1);
}

console.log('✅ All source files found. Creating modular implementation...');

// Create backups of all source files
for (const [name, filePath] of Object.entries(sourceFiles)) {
  const fileName = path.basename(filePath);
  fs.copyFileSync(filePath, path.join(backupDir, fileName + '.bak'));
}
console.log(`✅ Created backups in ${backupDir}`);

// Create new modular Firebase implementation

// 1. config.ts - Firebase configuration
const configContent = `/**
 * Firebase Configuration
 * 
 * This module centralizes Firebase configuration and environment variable handling.
 */

// Firebase configuration object
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase environment variables are properly set
export const isFirebaseConfigured = 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== undefined &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN !== undefined &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== undefined &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'placeholder-api-key' &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN !== 'placeholder-auth-domain' &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'placeholder-project-id';

// Define Firebase emulator settings
export const useEmulators = 
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true' &&
  process.env.VERCEL !== '1';

// Emulator configuration
export const emulatorConfig = {
  authHost: 'localhost',
  authPort: 9099,
  firestoreHost: 'localhost',
  firestorePort: 8080,
  storageHost: 'localhost',
  storagePort: 9199
};

// Check if running in client environment
export const isClient = typeof window !== 'undefined';

// Define admin emails for access control
export const ADMIN_EMAILS = ['admin@example.com', 'admin@realityportal.com'];
`;

// 2. index.ts - Main entry point for Firebase
const indexContent = `/**
 * Firebase Integration - Main Entry Point
 * 
 * This module provides a centralized entry point for Firebase services.
 * It initializes Firebase and exports the initialized services.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { Firestore, getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { Storage, getStorage, connectStorageEmulator } from 'firebase/storage';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { firebaseConfig, isFirebaseConfigured, isClient, useEmulators, emulatorConfig } from './config';
import { getAuth, Auth, connectAuthEmulator } from './auth';
import { initializeConnection } from './connection-monitor';

// Initialize Firebase variables
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: Storage | undefined;
let analytics: Analytics | undefined;

// Flag to track Firebase initialization
let initialized = false;
let initializing = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Initialize Firebase
 * @returns Promise that resolves when initialization is complete
 */
export const initializeFirebase = async (): Promise<void> => {
  // Skip initialization if not on client or not configured
  if (!isClient || !isFirebaseConfigured) {
    if (!isFirebaseConfigured && isClient) {
      console.warn(
        'Firebase environment variables are not set. Authentication and database features will not work properly.'
      );
    }
    return Promise.resolve();
  }

  // Return existing promise if initialization is already in progress
  if (initializationPromise) {
    return initializationPromise;
  }

  // Prevent concurrent initialization attempts
  if (initializing) {
    return new Promise(resolve => {
      const checkInitialized = setInterval(() => {
        if (initialized) {
          clearInterval(checkInitialized);
          resolve();
        }
      }, 100);
    });
  }

  initializing = true;

  // Create a new initialization promise
  initializationPromise = (async () => {
    try {
      // Initialize Firebase app if not already initialized
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

      // Initialize auth
      try {
        auth = getAuth(app);
        console.log('Firebase Auth initialized successfully');
      } catch (authError) {
        console.error('Firebase Auth initialization error:', authError);
      }

      // Initialize Firestore
      try {
        db = getFirestore(app);
        console.log('Firebase Firestore initialized successfully');
      } catch (dbError) {
        console.error('Firebase Firestore initialization error:', dbError);
      }

      // Initialize Storage
      try {
        storage = getStorage(app);
        console.log('Firebase Storage initialized successfully');
      } catch (storageError) {
        console.error('Firebase Storage initialization error:', storageError);
      }

      // Initialize Analytics in production only
      if (process.env.NODE_ENV === 'production' && isClient) {
        try {
          analytics = getAnalytics(app);
          console.log('Firebase Analytics initialized successfully');
        } catch (analyticsError) {
          console.error('Firebase Analytics initialization error:', analyticsError);
        }
      }

      // Connect to emulators in development environment
      if (useEmulators) {
        try {
          if (auth) connectAuthEmulator(auth, \`http://\${emulatorConfig.authHost}:\${emulatorConfig.authPort}\`);
          if (db) connectFirestoreEmulator(db, emulatorConfig.firestoreHost, emulatorConfig.firestorePort);
          if (storage) connectStorageEmulator(storage, emulatorConfig.storageHost, emulatorConfig.storagePort);
          console.log('Connected to Firebase emulators successfully');
        } catch (emulatorError) {
          console.error('Error connecting to Firebase emulators:', emulatorError);
        }
      }

      // Initialize connection monitoring
      initializeConnection();

      console.log('Firebase initialization completed');
      initialized = true;
      initializing = false;
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      initializing = false;
      // Re-throw to allow caller to handle
      throw error;
    }
  })();

  return initializationPromise;
};

/**
 * Returns a promise that resolves when Firebase is initialized
 */
export const waitForFirebaseInit = (): Promise<void> => {
  if (!isClient) return Promise.resolve();
  
  if (!initializationPromise) {
    return initializeFirebase();
  }
  
  return initializationPromise;
};

/**
 * Check if Firebase is initialized
 */
export const isFirebaseInitialized = (): boolean => {
  return initialized;
};

// Auto-initialize in browser environments
if (isClient) {
  initializeFirebase().catch(err => {
    console.error('Firebase initialization uncaught error:', err);
  });
}

// Types for Firestore collections
export interface Property {
  id: string;
  createdAt: Date;
  title: string;
  description: string;
  price: number;
  location: string;
  area: number;
  rooms?: number;
  propertyType: 'apartment' | 'house' | 'land' | 'commercial';
  userId: string;
  images: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  bathrooms?: number;
  landSize?: number;
  features?: string[];
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactVisibility?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  createdAt: Date;
  propertyId: string;
  senderId: string;
  recipientId: string;
  content: string;
  read: boolean;
}

export interface Favorite {
  id: string;
  createdAt: Date;
  userId: string;
  propertyId: string;
}

// Export Firebase instances
export { app, auth, db, storage, analytics };

// Export other Firebase modules
export * from './auth';
export * from './firestore';
export * from './storage';
export * from './connection-monitor';
`;

// 3. auth.ts - Unified authentication module
const authContent = `/**
 * Firebase Authentication Module
 * 
 * This module provides a unified interface for Firebase authentication 
 * with proper error handling and environment detection.
 */

import { 
  Auth as FirebaseAuth,
  getAuth as getFirebaseAuth,
  signInWithEmailAndPassword as signInWithEmailAndPasswordOriginal,
  createUserWithEmailAndPassword as createUserWithEmailAndPasswordOriginal,
  sendPasswordResetEmail as sendPasswordResetEmailOriginal,
  signOut as signOutOriginal,
  onAuthStateChanged as onAuthStateChangedOriginal,
  updateProfile as updateProfileOriginal,
  User,
  UserCredential,
  connectAuthEmulator as connectAuthEmulatorOriginal
} from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';
import { isClient } from './config';

// Types and interfaces
export type Auth = FirebaseAuth;
export type { User, UserCredential };
export interface AuthError {
  code: string;
  message: string;
}

// Flag to track if auth module is ready
let isAuthModuleReady = false;
let authModuleReadyPromise: Promise<void> | null = null;

/**
 * Wait for auth module to be ready
 */
export const waitForAuthModule = (): Promise<void> => {
  if (isAuthModuleReady) {
    return Promise.resolve();
  }

  if (!authModuleReadyPromise) {
    authModuleReadyPromise = new Promise<void>((resolve) => {
      // In client environment, we can import firebase/auth right away
      if (isClient) {
        isAuthModuleReady = true;
        resolve();
      } else {
        // In server environment, mark as ready immediately
        // but authentication operations will be stubs
        isAuthModuleReady = true;
        resolve();
      }
    });
  }

  return authModuleReadyPromise;
};

/**
 * Get Firebase Auth instance
 */
export function getAuth(app?: FirebaseApp): Auth {
  if (!isClient) {
    // Return stub
    return {} as Auth;
  }
  
  try {
    return getFirebaseAuth(app);
  } catch (error) {
    console.error('Error getting auth:', error);
    return {} as Auth;
  }
}

/**
 * Connect to Auth Emulator
 */
export function connectAuthEmulator(auth: Auth, url: string): void {
  if (!isClient) return;
  
  try {
    connectAuthEmulatorOriginal(auth, url);
  } catch (error) {
    console.error('Error connecting to auth emulator:', error);
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmailAndPassword(
  auth: Auth,
  email: string,
  password: string
): Promise<UserCredential> {
  if (!isClient) {
    throw new Error('Cannot sign in on server-side');
  }
  
  try {
    return await signInWithEmailAndPasswordOriginal(auth, email, password);
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw {
      code: error.code || 'auth/unknown',
      message: error.message || 'An unknown error occurred during sign in'
    };
  }
}

/**
 * Create user with email and password
 */
export async function createUserWithEmailAndPassword(
  auth: Auth,
  email: string,
  password: string
): Promise<UserCredential> {
  if (!isClient) {
    throw new Error('Cannot create user on server-side');
  }
  
  try {
    return await createUserWithEmailAndPasswordOriginal(auth, email, password);
  } catch (error: any) {
    console.error('Create user error:', error);
    throw {
      code: error.code || 'auth/unknown',
      message: error.message || 'An unknown error occurred during sign up'
    };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  auth: Auth,
  email: string
): Promise<void> {
  if (!isClient) {
    throw new Error('Cannot send password reset email on server-side');
  }
  
  try {
    return await sendPasswordResetEmailOriginal(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw {
      code: error.code || 'auth/unknown',
      message: error.message || 'An unknown error occurred during password reset'
    };
  }
}

/**
 * Sign out
 */
export async function signOut(auth: Auth): Promise<void> {
  if (!isClient) {
    throw new Error('Cannot sign out on server-side');
  }
  
  try {
    return await signOutOriginal(auth);
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw {
      code: error.code || 'auth/unknown',
      message: error.message || 'An unknown error occurred during sign out'
    };
  }
}

/**
 * Update user profile
 */
export async function updateProfile(
  user: User,
  profileData: { displayName?: string | null; photoURL?: string | null }
): Promise<void> {
  if (!isClient) {
    throw new Error('Cannot update profile on server-side');
  }
  
  try {
    return await updateProfileOriginal(user, profileData);
  } catch (error: any) {
    console.error('Update profile error:', error);
    throw {
      code: error.code || 'auth/unknown',
      message: error.message || 'An unknown error occurred during profile update'
    };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChanged(
  auth: Auth,
  callback: (user: User | null) => void
): () => void {
  if (!isClient) {
    // Return a no-op unsubscribe
    return () => {};
  }
  
  try {
    return onAuthStateChangedOriginal(auth, callback);
  } catch (error) {
    console.error('Auth state listener error:', error);
    // Return a no-op unsubscribe
    return () => {};
  }
}

// Mark module as ready
isAuthModuleReady = true;
`;

// 4. firestore.ts - Unified Firestore module
const firestoreContent = `/**
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
    \`Failed to get document after \${MAX_RETRIES} attempts: \${lastError?.message || 'unknown error'}\`,
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
    \`Failed to query documents after \${MAX_RETRIES} attempts: \${lastError?.message || 'unknown error'}\`,
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
    \`Failed to add document after \${MAX_RETRIES} attempts: \${lastError?.message || 'unknown error'}\`,
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
    \`Failed to set document after \${MAX_RETRIES} attempts: \${lastError?.message || 'unknown error'}\`,
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
    \`Failed to update document after \${MAX_RETRIES} attempts: \${lastError?.message || 'unknown error'}\`,
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
    \`Failed to delete document after \${MAX_RETRIES} attempts: \${lastError?.message || 'unknown error'}\`,
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
  return safeUpdateDoc<Partial<Property>>('properties', id, {
    ...property,
    updatedAt: serverTimestamp() as any
  });
};

// Delete a property
export const deleteProperty = async (id: string): Promise<void> => {
  return safeDeleteDoc('properties', id);
};
`;

// 5. connection-monitor.ts - Simplified connection monitoring
const connectionMonitorContent = `/**
 * Firebase Connection Monitor
 * 
 * This module provides connection monitoring and reconnection handling.
 */

import { getDatabase, ref, onValue, off, serverTimestamp, set } from 'firebase/database';
import { app } from './index';
import { isClient } from './config';

// Connection state tracking
let isConnected = false;
let connectionMonitorInitialized = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const CONNECTION_CHECK_INTERVAL = 10000; // 10 seconds
let connectionListeners: Array<(connected: boolean) => void> = [];
let connectionCheckInterval: NodeJS.Timeout | null = null;

/**
 * Initialize the connection monitor
 */
export function initializeConnection(): void {
  if (connectionMonitorInitialized || !isClient || !app) return;
  
  try {
    const db = getDatabase(app);
    const connectedRef = ref(db, '.info/connected');
    
    // Listen for connection state changes
    onValue(connectedRef, (snapshot) => {
      isConnected = !!snapshot.val();
      
      // Notify all listeners of connection state change
      notifyConnectionListeners();
      
      if (isConnected) {
        console.log('Firebase connection established');
        reconnectAttempts = 0;
        updateLastSeen();
      } else {
        console.log('Firebase connection lost');
        attemptReconnect();
      }
    });
    
    // Set up periodic connection check
    connectionCheckInterval = setInterval(checkConnection, CONNECTION_CHECK_INTERVAL);
    
    connectionMonitorInitialized = true;
    console.log('Firebase connection monitor initialized');
  } catch (error) {
    console.error('Failed to initialize Firebase connection monitor:', error);
  }
}

/**
 * Attempt to reconnect to Firebase
 */
function attemptReconnect(): void {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error('Failed to reconnect to Firebase after maximum attempts');
    return;
  }
  
  reconnectAttempts++;
  console.log(\`Attempting to reconnect to Firebase (\${reconnectAttempts}/\${MAX_RECONNECT_ATTEMPTS})\`);
  
  // Force refresh of Firebase connections
  try {
    const db = getDatabase(app);
    const testRef = ref(db, \`connection-test/\${new Date().getTime()}\`);
    set(testRef, { timestamp: serverTimestamp() })
      .then(() => {
        console.log('Reconnection test successful');
        isConnected = true;
        notifyConnectionListeners();
      })
      .catch((error) => {
        console.error('Reconnection test failed:', error);
        // Schedule another reconnection attempt with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        setTimeout(attemptReconnect, delay);
      });
  } catch (error) {
    console.error('Error during reconnection attempt:', error);
  }
}

/**
 * Check current Firebase connection status
 */
function checkConnection(): void {
  if (!isConnected && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    attemptReconnect();
  }
}

/**
 * Update last seen timestamp
 */
function updateLastSeen(): void {
  if (!isConnected || !app) return;
  
  try {
    const db = getDatabase(app);
    const userId = getUserIdentifier();
    if (!userId) return;
    
    const lastSeenRef = ref(db, \`client-status/\${userId}\`);
    set(lastSeenRef, { 
      lastSeen: serverTimestamp(),
      userAgent: navigator.userAgent,
      appVersion: '1.0.0'
    }).catch(error => {
      console.warn('Failed to update last seen status:', error);
    });
  } catch (error) {
    console.warn('Error updating last seen:', error);
  }
}

/**
 * Get a unique identifier for the current user
 */
function getUserIdentifier(): string {
  // Try to get the user's ID if authenticated
  try {
    const userId = localStorage.getItem('userId');
    if (userId) return userId;
  } catch (e) {
    // Ignore localStorage errors
  }
  
  // Generate and store a session ID if not available
  let sessionId = '';
  try {
    sessionId = localStorage.getItem('firebase_session_id') || '';
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('firebase_session_id', sessionId);
    }
  } catch (e) {
    // If localStorage fails, generate a temporary session ID
    sessionId = 'temp_' + Math.random().toString(36).substring(2, 15);
  }
  
  return sessionId;
}

/**
 * Register a listener for connection state changes
 */
export function onConnectionChange(listener: (connected: boolean) => void): () => void {
  connectionListeners.push(listener);
  
  // Call immediately with current state
  listener(isConnected);
  
  return () => {
    connectionListeners = connectionListeners.filter(l => l !== listener);
  };
}

/**
 * Notify all listeners of connection state change
 */
function notifyConnectionListeners(): void {
  connectionListeners.forEach(listener => {
    try {
      listener(isConnected);
    } catch (error) {
      console.error('Error in connection listener:', error);
    }
  });
}

/**
 * Clean up connection monitor
 */
export function cleanupConnectionMonitor(): void {
  if (!connectionMonitorInitialized) return;
  
  try {
    // Clear connection check interval
    if (connectionCheckInterval) {
      clearInterval(connectionCheckInterval);
      connectionCheckInterval = null;
    }
    
    // Remove Firebase connection listener
    if (app) {
      const db = getDatabase(app);
      const connectedRef = ref(db, '.info/connected');
      off(connectedRef);
    }
    
    connectionListeners = [];
    connectionMonitorInitialized = false;
    console.log('Firebase connection monitor cleaned up');
  } catch (error) {
    console.error('Error cleaning up connection monitor:', error);
  }
}

/**
 * Get current connection state
 */
export function isFirebaseConnected(): boolean {
  return isConnected;
}
`;

// 6. storage.ts - Storage utilities
const storageContent = `/**
 * Firebase Storage Module
 * 
 * This module provides a unified interface for Firebase Storage operations.
 */

import { 
  getStorage as getStorageOriginal, 
  ref, 
  uploadBytes, 
  uploadBytesResumable,
  getDownloadURL, 
  deleteObject,
  UploadTask,
  ListResult,
  list,
  StorageReference
} from 'firebase/storage';
import { FirebaseApp } from 'firebase/app';
import { isClient } from './config';

/**
 * Get Firebase Storage instance
 */
export function getStorage(app?: FirebaseApp) {
  if (!isClient) {
    throw new Error('Storage is only available on client-side');
  }
  
  try {
    return getStorageOriginal(app);
  } catch (error) {
    console.error('Error getting storage:', error);
    throw error;
  }
}

/**
 * Upload a file to Firebase Storage
 */
export async function uploadFile(
  filePath: string, 
  file: Blob | Uint8Array | ArrayBuffer,
  metadata?: { contentType?: string, customMetadata?: { [key: string]: string } }
): Promise<string> {
  if (!isClient) {
    throw new Error('Cannot upload files on server-side');
  }

  try {
    const storage = getStorageOriginal();
    const storageRef = ref(storage, filePath);
    
    await uploadBytes(storageRef, file, metadata);
    
    // Get download URL
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * Upload a file with progress monitoring
 */
export function uploadFileWithProgress(
  filePath: string, 
  file: Blob | Uint8Array | ArrayBuffer,
  metadata?: { contentType?: string, customMetadata?: { [key: string]: string } }
): UploadTask {
  if (!isClient) {
    throw new Error('Cannot upload files on server-side');
  }

  try {
    const storage = getStorageOriginal();
    const storageRef = ref(storage, filePath);
    
    return uploadBytesResumable(storageRef, file, metadata);
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * Get download URL for a file
 */
export async function getFileUrl(filePath: string): Promise<string> {
  if (!isClient) {
    throw new Error('Cannot get file URL on server-side');
  }

  try {
    const storage = getStorageOriginal();
    const storageRef = ref(storage, filePath);
    
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  if (!isClient) {
    throw new Error('Cannot delete files on server-side');
  }

  try {
    const storage = getStorageOriginal();
    const storageRef = ref(storage, filePath);
    
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * List files in a directory
 */
export async function listFiles(directoryPath: string, maxResults = 100): Promise<ListResult> {
  if (!isClient) {
    throw new Error('Cannot list files on server-side');
  }

  try {
    const storage = getStorageOriginal();
    const directoryRef = ref(storage, directoryPath);
    
    return await list(directoryRef, { maxResults });
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

/**
 * Create a storage reference
 */
export function createStorageRef(path: string): StorageReference {
  if (!isClient) {
    throw new Error('Cannot create storage references on server-side');
  }

  try {
    const storage = getStorageOriginal();
    return ref(storage, path);
  } catch (error) {
    console.error('Error creating storage reference:', error);
    throw error;
  }
}
`;

// 7. auth-context.tsx - Unified Auth Context
const authContextContent = `/**
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
  document.cookie = \`\${name}=\${encodeURIComponent(value)}; expires=\${expires}; path=/; SameSite=Strict; Secure\`;
};

const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  
  document.cookie = \`\${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure\`;
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
  updateProfile: async () => {}
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
        setUser({ ...user, displayName: name });
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
      updateProfile: handleUpdateProfile
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
`;

// Legacy wrapper for compatibility
const legacyWrapper = (module) => `/**
 * @deprecated Import from '@/utils/firebase' instead.
 * This file is kept for backward compatibility.
 */

export * from './firebase/${module}';
export { default } from './firebase/${module}';
`;

// Write new modular Firebase implementation files
fs.writeFileSync(path.join(firebaseDir, 'config.ts'), configContent);
fs.writeFileSync(path.join(firebaseDir, 'index.ts'), indexContent);
fs.writeFileSync(path.join(firebaseDir, 'auth.ts'), authContent);
fs.writeFileSync(path.join(firebaseDir, 'firestore.ts'), firestoreContent);
fs.writeFileSync(path.join(firebaseDir, 'connection-monitor.ts'), connectionMonitorContent);
fs.writeFileSync(path.join(firebaseDir, 'storage.ts'), storageContent);
fs.writeFileSync(path.join(firebaseDir, 'auth-context.tsx'), authContextContent);
console.log(`✅ Created modular Firebase implementation in ${firebaseDir}`);

// Create legacy wrappers for backward compatibility
fs.writeFileSync(sourceFiles.firebase, legacyWrapper('index'));
fs.writeFileSync(sourceFiles.firebaseInitGuard, legacyWrapper('index'));
fs.writeFileSync(sourceFiles.firebaseAuthUnified, legacyWrapper('auth'));
fs.writeFileSync(sourceFiles.firebaseAuthStub, legacyWrapper('auth'));
fs.writeFileSync(sourceFiles.firebaseConnectionMonitor, legacyWrapper('connection-monitor'));
fs.writeFileSync(sourceFiles.firebaseService, legacyWrapper('index'));
fs.writeFileSync(sourceFiles.firestore, legacyWrapper('firestore'));
fs.writeFileSync(sourceFiles.firestoreUtils, legacyWrapper('firestore'));
fs.writeFileSync(sourceFiles.firestoreErrorHandler, legacyWrapper('firestore'));
fs.writeFileSync(sourceFiles.authContext, legacyWrapper('auth-context'));
fs.writeFileSync(sourceFiles.authContextNew, legacyWrapper('auth-context'));
console.log(`✅ Created legacy wrappers for backward compatibility`);

console.log('\n✨ Firebase utilities successfully consolidated!');
console.log('\n⚠️ Consider updating imports in files:');
console.log('   from: import { ... } from \'@/utils/firebase\' (or other direct imports)');
console.log('   to:   import { ... } from \'@/utils/firebase\' (unified import)');

/**
 * Firebase Integration - Main Entry Point
 * 
 * This module provides a centralized entry point for Firebase services.
 * It initializes Firebase and exports the initialized services.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { Firestore, getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { firebaseConfig, isFirebaseConfigured, isClient, useEmulators, emulatorConfig } from './config';
import { getAuth, Auth, connectAuthEmulator } from './auth';
import { initializeConnection } from './connection-monitor';

// Initialize Firebase variables
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let fbStorage: FirebaseStorage | undefined;
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
        fbStorage = getStorage(app);
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
          if (auth) connectAuthEmulator(auth, `http://${emulatorConfig.authHost}:${emulatorConfig.authPort}`);
          if (db) connectFirestoreEmulator(db, emulatorConfig.firestoreHost, emulatorConfig.firestorePort);
          if (fbStorage) connectStorageEmulator(fbStorage, emulatorConfig.storageHost, emulatorConfig.storagePort);
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
export { app, auth, db, fbStorage as storage, analytics };

// Export other Firebase modules
export * from './auth';
export * from './firestore';
export * from './storage';
export * from './connection-monitor';

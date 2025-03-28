// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from './firebase-auth-unified';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase environment variables are properly set with real values (not placeholders)
export const isFirebaseConfigured =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== undefined &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN !== undefined &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== undefined &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'placeholder-api-key' &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN !== 'placeholder-auth-domain' &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'placeholder-project-id';

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

// Initialize Firebase variables
let app: ReturnType<typeof initializeApp> | undefined;
let auth: ReturnType<typeof getAuth> | undefined;
let db: ReturnType<typeof getFirestore> | undefined;
let storage: ReturnType<typeof getStorage> | undefined;

// Maximum number of retries for Firebase initialization
// Use fewer retries in development for faster startup
const MAX_INIT_RETRIES = process.env.NODE_ENV === 'development' ? 1 : 3;

// Initialize Firebase with retry mechanism
const initializeFirebase = (retryCount = 0) => {
  // Skip initialization if not on client or not configured
  if (!isClient || !isFirebaseConfigured) {
    if (!isFirebaseConfigured && isClient) {
      console.warn(
        'Firebase environment variables are not set. Authentication and database features will not work properly. ' +
          'Please ensure NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, and NEXT_PUBLIC_FIREBASE_PROJECT_ID are set in your environment.'
      );
    }
    return;
  }

  try {
    // Initialize Firebase app if not already initialized
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    // Initialize auth with proper error handling
    try {
      auth = getAuth(app);
      console.log('Firebase Auth initialized successfully');
    } catch (authError) {
      console.error('Firebase Auth initialization error:', authError);
      // We continue even if auth fails, to allow other services to work
    }

    // Initialize Firestore with proper error handling
    try {
      db = getFirestore(app);
      console.log('Firebase Firestore initialized successfully');
    } catch (dbError) {
      console.error('Firebase Firestore initialization error:', dbError);
    }

    // Initialize Storage with proper error handling
    try {
      storage = getStorage(app);
      console.log('Firebase Storage initialized successfully');
    } catch (storageError) {
      console.error('Firebase Storage initialization error:', storageError);
    }

    // Connect to emulators in development environment only (never on Vercel)
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true' &&
      process.env.VERCEL !== '1'
    ) {
      try {
        if (auth) connectAuthEmulator(auth, 'http://localhost:9099');
        if (db) connectFirestoreEmulator(db, 'localhost', 8080);
        if (storage) connectStorageEmulator(storage, 'localhost', 9199);
        console.log('Connected to Firebase emulators successfully');
      } catch (emulatorError) {
        console.error('Error connecting to Firebase emulators:', emulatorError);
      }
    }

    console.log('Firebase initialization completed');
  } catch (error) {
    console.error(`Firebase initialization attempt ${retryCount + 1} failed:`, error);

    // Retry initialization with exponential backoff
    if (retryCount < MAX_INIT_RETRIES) {
      // Use shorter delays in development for faster startup
      const baseDelay = process.env.NODE_ENV === 'development' ? 100 : 500;
      const delay = Math.pow(2, retryCount) * baseDelay; // Development: 100ms, 200ms; Production: 500ms, 1s, 2s
      console.log(`Retrying Firebase initialization in ${delay}ms...`);

      setTimeout(() => {
        initializeFirebase(retryCount + 1);
      }, delay);
    } else {
      console.error(`Failed to initialize Firebase after ${MAX_INIT_RETRIES} attempts`);
    }
  }
};

// Run initialization
if (isClient) {
  initializeFirebase();
}

// Types for our database collections
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
  // Adding missing properties
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

export { app, auth, db, storage };

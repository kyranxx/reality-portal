/**
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
  // Add the correct regional database URL
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 
               'https://realitny-portal-default-rtdb.europe-west1.firebasedatabase.app',
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

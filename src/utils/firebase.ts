// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
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

// Check if Firebase environment variables are properly set
export const isFirebaseConfigured = 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== undefined && 
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN !== undefined &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== undefined;

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Connect to emulators in development environment
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}

// Log a warning if environment variables are not set
if (!isFirebaseConfigured) {
  console.warn(
    'Firebase environment variables are not set. Authentication and database features will not work properly. ' +
    'Please ensure NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, and NEXT_PUBLIC_FIREBASE_PROJECT_ID are set in your environment.'
  );
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

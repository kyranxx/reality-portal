/**
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
    // Convert null to undefined to match the expected type
    const sanitizedProfileData = {
      displayName: profileData.displayName === null ? undefined : profileData.displayName,
      photoURL: profileData.photoURL === null ? undefined : profileData.photoURL
    };
    return await updateProfileOriginal(user, sanitizedProfileData);
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

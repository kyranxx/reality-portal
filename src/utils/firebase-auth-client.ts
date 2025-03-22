/**
 * Firebase Auth client-side implementation
 * Used in browser environments
 * 
 * IMPORTANT: This is a simplified implementation for compatibility with Vercel
 */

// Define type aliases for better type safety
export type Auth = any;
export type User = any;
export type UserCredential = any;
export type AuthProvider = any;
export type AuthError = any;

// Dummy implementations for Vercel compatibility
// These functions are only meant to be used by server-side rendering in Vercel environment
// The actual auth functionality comes through the Firebase client SDK in the browser
export const onAuthStateChanged = (auth: any, callback: any) => {
  if (typeof window === 'undefined') {
    console.warn('Called onAuthStateChanged server-side - returning dummy implementation');
    return () => {};
  }
  
  try {
    // In the browser, get the actual implementation
    return auth.onAuthStateChanged(callback);
  } catch (error) {
    console.error('Error in onAuthStateChanged:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

export const createUserWithEmailAndPassword = async (auth: any, email: string, password: string) => {
  if (typeof window === 'undefined') {
    console.warn('Called createUserWithEmailAndPassword server-side - returning dummy implementation');
    throw new Error('Authentication operations cannot be performed on the server');
  }
  
  try {
    return await auth.createUserWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Error in createUserWithEmailAndPassword:', error);
    throw error;
  }
};

export const signInWithEmailAndPassword = async (auth: any, email: string, password: string) => {
  if (typeof window === 'undefined') {
    console.warn('Called signInWithEmailAndPassword server-side - returning dummy implementation');
    throw new Error('Authentication operations cannot be performed on the server');
  }
  
  try {
    return await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Error in signInWithEmailAndPassword:', error);
    throw error;
  }
};

export const signOut = async (auth: any) => {
  if (typeof window === 'undefined') {
    console.warn('Called signOut server-side - returning dummy implementation');
    throw new Error('Authentication operations cannot be performed on the server');
  }
  
  try {
    return await auth.signOut();
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
};

export class GoogleAuthProvider {
  static credential() {
    return {};
  }
  
  addScope() {}
  setCustomParameters() {}
}

export const signInWithPopup = async (auth: any, provider: any) => {
  if (typeof window === 'undefined') {
    console.warn('Called signInWithPopup server-side - returning dummy implementation');
    throw new Error('Authentication operations cannot be performed on the server');
  }
  
  try {
    return await auth.signInWithPopup(provider);
  } catch (error) {
    console.error('Error in signInWithPopup:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (auth: any, email: string) => {
  if (typeof window === 'undefined') {
    console.warn('Called sendPasswordResetEmail server-side - returning dummy implementation');
    throw new Error('Authentication operations cannot be performed on the server');
  }
  
  try {
    return await auth.sendPasswordResetEmail(email);
  } catch (error) {
    console.error('Error in sendPasswordResetEmail:', error);
    throw error;
  }
};

// Very important - make getAuth a no-op for SSR but working in the browser
export const getAuth = (app?: any) => {
  if (typeof window === 'undefined') {
    console.warn('Called getAuth server-side - returning dummy implementation');
    return {};
  }
  
  // In the browser, get the actual Firebase auth instance
  try {
    // Dynamic import to avoid SSR issues
    const firebaseApp = app || (window as any).firebase?.app();
    return firebaseApp?.auth?.() || {};
  } catch (error) {
    console.error('Error in getAuth:', error);
    return {};
  }
};

export const connectAuthEmulator = (auth: any, url: string, options?: any) => {
  if (typeof window === 'undefined') {
    console.warn('Called connectAuthEmulator server-side - returning dummy implementation');
    return;
  }
  
  try {
    if (auth.useEmulator) {
      return auth.useEmulator(url, options);
    } else if (auth.connectAuthEmulator) {
      return options ? auth.connectAuthEmulator(url, options) : auth.connectAuthEmulator(url);
    }
  } catch (error) {
    console.error('Error in connectAuthEmulator:', error);
  }
};

// Log initialization
console.log('Initialized firebase-auth-client');

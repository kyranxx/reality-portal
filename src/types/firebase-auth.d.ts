/**
 * Type declarations for @firebase/auth
 * This file helps TypeScript understand the structure of the @firebase/auth module
 * by re-exporting simplified types that won't cause issues during build
 */

declare module '@firebase/auth' {
  // Define simpler type interfaces to avoid complex imports
  export type Auth = any;
  export type User = any;
  export type UserCredential = { user: User };
  export type AuthProvider = any;

  // Explicitly declare the functions using simplified types
  export function createUserWithEmailAndPassword(
    auth: Auth,
    email: string,
    password: string
  ): Promise<UserCredential>;

  export function signInWithEmailAndPassword(
    auth: Auth,
    email: string,
    password: string
  ): Promise<UserCredential>;

  export function signOut(auth: Auth): Promise<void>;

  export class GoogleAuthProvider {
    static PROVIDER_ID: string;
    providerId: string;
    addScope(scope: string): GoogleAuthProvider;
    setCustomParameters(customOAuthParameters: Object): GoogleAuthProvider;
    static credential(idToken?: string, accessToken?: string): any;
  }

  export function signInWithPopup(auth: Auth, provider: AuthProvider): Promise<UserCredential>;

  export function sendPasswordResetEmail(auth: Auth, email: string): Promise<void>;

  export function getAuth(app?: any): Auth;

  export function connectAuthEmulator(
    auth: Auth,
    url: string,
    options?: { disableWarnings?: boolean }
  ): void;

  export function onAuthStateChanged(
    auth: Auth,
    nextOrObserver: any,
    error?: any,
    completed?: any
  ): () => void;
  
  export function updateProfile(
    user: User,
    profile: { displayName?: string; photoURL?: string }
  ): Promise<void>;
}

// Extend User type to include common properties used in the app
declare global {
  interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
  }
}

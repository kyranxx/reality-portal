/**
 * Type declarations for @firebase/auth
 * This file helps TypeScript understand the structure of the @firebase/auth module
 * by re-exporting types from firebase/auth
 */

declare module '@firebase/auth' {
  // Re-export all types from firebase/auth
  export * from 'firebase/auth';

  // Explicitly declare the functions that are imported from @firebase/auth
  export function createUserWithEmailAndPassword(
    auth: import('firebase/auth').Auth,
    email: string,
    password: string
  ): Promise<import('firebase/auth').UserCredential>;

  export function signInWithEmailAndPassword(
    auth: import('firebase/auth').Auth,
    email: string,
    password: string
  ): Promise<import('firebase/auth').UserCredential>;

  export function signOut(
    auth: import('firebase/auth').Auth
  ): Promise<void>;

  export class GoogleAuthProvider implements import('firebase/auth').AuthProvider {
    static PROVIDER_ID: string;
    providerId: string;
    addScope(scope: string): import('firebase/auth').AuthProvider;
    setCustomParameters(
      customOAuthParameters: Object
    ): import('firebase/auth').AuthProvider;
  }

  export function signInWithPopup(
    auth: import('firebase/auth').Auth,
    provider: import('firebase/auth').AuthProvider
  ): Promise<import('firebase/auth').UserCredential>;

  export function sendPasswordResetEmail(
    auth: import('firebase/auth').Auth,
    email: string
  ): Promise<void>;

  export function getAuth(
    app?: import('firebase/app').FirebaseApp
  ): import('firebase/auth').Auth;

  export function connectAuthEmulator(
    auth: import('firebase/auth').Auth,
    url: string,
    options?: { disableWarnings?: boolean }
  ): void;
}

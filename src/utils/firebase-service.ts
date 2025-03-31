/**
 * Firebase Service
 *
 * A robust service layer for all Firebase operations with proper initialization
 * sequence, atomic operations, and comprehensive error handling.
 */

import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import {
  Auth,
  User,
  UserCredential,
  getAuth as getFirebaseAuth,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signInWithEmailAndPassword as firebaseSignIn,
  signInWithPopup as firebaseSignInWithPopup,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  Firestore,
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { getStorage, ref, StorageReference } from 'firebase/storage';

// Define Storage type since it's not exported from firebase/storage
type Storage = ReturnType<typeof getStorage>;
import { handleFirebaseError } from './firestore-error-handler';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

// Service initialization state
type InitState = 'pending' | 'initializing' | 'initialized' | 'failed';

// Operation queue for pending operations
interface QueuedOperation<T> {
  operation: () => Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

/**
 * Firebase Service Class
 * Manages all Firebase interactions with proper initialization guards and error handling
 */
class FirebaseService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private db: Firestore | null = null;
  private storage: Storage | null = null;
  private initState: InitState = 'pending';
  private operationQueue: QueuedOperation<any>[] = [];
  private authInitPromise: Promise<void> | null = null;
  private authStateListeners: Array<(user: User | null) => void> = [];
  private currentUser: User | null = null;
  private googleProvider: GoogleAuthProvider | null = null;

  constructor() {
    if (!isClient) {
      console.log('Firebase Service: Running in server environment');
      this.initState = 'initialized'; // No initialization needed on server
      return;
    }

    this.initialize();
  }

  /**
   * Initialize Firebase services with proper error handling and atomic operations
   */
  private initialize(): void {
    if (!isClient || this.initState !== 'pending') return;

    this.initState = 'initializing';
    console.log('Firebase Service: Initializing...');

    try {
      // Initialize Firebase app if not already initialized
      if (!getApps().length) {
        this.app = initializeApp(firebaseConfig);
      } else {
        this.app = getApps()[0];
      }

      // Initialize auth with proper error handling
      try {
        this.auth = getFirebaseAuth(this.app);

        // Create auth initialization promise
        this.authInitPromise = new Promise<void>(resolve => {
          // Using the unsubscribe pattern to ensure we don't leak listeners
          const unsubscribe = onAuthStateChanged(
            this.auth as Auth,
            (user: User | null) => {
              this.currentUser = user;
              unsubscribe();
              resolve();

              // Set up permanent auth state listener
              onAuthStateChanged(this.auth as Auth, (user: User | null) => {
                this.currentUser = user;
                // Notify all listeners
                this.authStateListeners.forEach(listener => listener(user));
              });
            },
            (error: any) => {
              console.error('Auth state change error:', error);
              unsubscribe();
              resolve(); // Resolve anyway to prevent hanging
            }
          );
        });

        console.log('Firebase Service: Auth initialized');
      } catch (authError) {
        console.error('Firebase Service: Auth initialization error:', authError);
        // Continue to initialize other services even if auth fails
      }

      // Initialize Firestore
      try {
        this.db = getFirestore(this.app);
        console.log('Firebase Service: Firestore initialized');
      } catch (dbError) {
        console.error('Firebase Service: Firestore initialization error:', dbError);
      }

      // Initialize Storage
      try {
        this.storage = getStorage(this.app);
        console.log('Firebase Service: Storage initialized');
      } catch (storageError) {
        console.error('Firebase Service: Storage initialization error:', storageError);
      }

      // Initialize Google provider
      try {
        this.googleProvider = new GoogleAuthProvider();
        this.googleProvider.addScope('profile');
        this.googleProvider.addScope('email');
        this.googleProvider.setCustomParameters({
          prompt: 'select_account',
        });
      } catch (error) {
        console.error('Firebase Service: Google provider initialization error:', error);
      }

      this.initState = 'initialized';
      console.log('Firebase Service: Initialization complete');

      // Process queued operations
      this.processQueue();
    } catch (error) {
      this.initState = 'failed';
      console.error('Firebase Service: Initialization failed:', error);
    }
  }

  /**
   * Process queued operations after initialization
   */
  private processQueue(): void {
    while (this.operationQueue.length > 0) {
      const queuedOp = this.operationQueue.shift();
      if (queuedOp) {
        queuedOp.operation().then(queuedOp.resolve).catch(queuedOp.reject);
      }
    }
  }

  /**
   * Execute an operation with initialization guard
   * @param operation Function to execute
   * @returns Promise with operation result
   */
  private async executeWithInitGuard<T>(operation: () => Promise<T>): Promise<T> {
    // If we're on the server, return a default value or throw an appropriate error
    if (!isClient) {
      throw new Error('Firebase operation attempted on server side');
    }

    // If already initialized, execute immediately
    if (this.initState === 'initialized') {
      return operation();
    }

    // If initialization failed, throw an error
    if (this.initState === 'failed') {
      throw new Error('Firebase initialization failed, cannot execute operation');
    }

    // Otherwise, queue the operation
    return new Promise<T>((resolve, reject) => {
      this.operationQueue.push({
        operation,
        resolve,
        reject,
      });
    });
  }

  /**
   * Wait for auth to be initialized
   * @returns Promise that resolves when auth is ready
   */
  public async waitForAuth(): Promise<void> {
    if (!isClient) return Promise.resolve();
    if (!this.authInitPromise) return Promise.resolve();
    return this.authInitPromise;
  }

  /**
   * Get the current authenticated user
   * @returns Current user or null if not authenticated
   */
  /**
   * Check if Firebase is fully initialized
   * @returns Boolean indicating whether Firebase is initialized
   */
  public isInitialized(): boolean {
    return this.initState === 'initialized';
  }

  /**
   * Get the current authenticated user
   * @returns Current user or null if not authenticated
   */
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Subscribe to auth state changes
   * @param listener Function to call with user object when auth state changes
   * @returns Unsubscribe function
   */
  public onAuthStateChange(listener: (user: User | null) => void): () => void {
    this.authStateListeners.push(listener);

    // Immediately call with current user
    if (isClient) {
      listener(this.currentUser);
    }

    // Return unsubscribe function that properly handles cleanup
    return () => {
      // Remove the listener from our internal array
      this.authStateListeners = this.authStateListeners.filter(l => l !== listener);
      
      // Log cleanup for debugging purposes
      console.debug('Firebase listener cleanup executed');
    };
  }

  /**
   * Creates a properly wrapped Firestore listener that ensures cleanup
   * @param setup Function that sets up the listener and returns its unsubscribe function
   * @returns A cleanup function that should be called when the component unmounts
   */
  public createSafeListener(setup: () => () => void): () => void {
    // Execute the setup function to create the listener
    const unsubscribe = setup();
    
    // Return a wrapper that ensures proper cleanup
    return () => {
      try {
        // Call the original unsubscribe function
        unsubscribe();
        console.debug('Firebase listener safely unsubscribed');
      } catch (error) {
        console.warn('Error during Firebase listener cleanup:', error);
      }
    };
  }

  /**
   * Sign in with email and password
   * @param email User email
   * @param password User password
   * @returns Promise with UserCredential
   */
  public async signInWithEmailPassword(email: string, password: string): Promise<UserCredential> {
    return this.executeWithInitGuard(async () => {
      if (!this.auth) throw new Error('Auth not initialized');

      try {
        return await firebaseSignIn(this.auth, email, password);
      } catch (error) {
        const processed = handleFirebaseError(error, 'signInWithEmailPassword');
        throw new Error(processed.message);
      }
    });
  }

  /**
   * Sign in with Google
   * @returns Promise with UserCredential
   */
  public async signInWithGoogle(): Promise<UserCredential> {
    return this.executeWithInitGuard(async () => {
      if (!this.auth || !this.googleProvider) {
        throw new Error('Auth or Google provider not initialized');
      }

      try {
        return await firebaseSignInWithPopup(this.auth, this.googleProvider);
      } catch (error: any) {
        // Handle specific popup errors
        if (error.code === 'auth/popup-blocked') {
          throw new Error('Popup was blocked by your browser. Please allow popups for this site.');
        } else if (error.code === 'auth/popup-closed-by-user') {
          throw new Error('Authentication was cancelled. Please try again.');
        }

        const processed = handleFirebaseError(error, 'signInWithGoogle');
        throw new Error(processed.message);
      }
    });
  }

  /**
   * Create a new user with email and password
   * @param email User email
   * @param password User password
   * @returns Promise with UserCredential
   */
  public async createUserWithEmailPassword(
    email: string,
    password: string
  ): Promise<UserCredential> {
    return this.executeWithInitGuard(async () => {
      if (!this.auth) throw new Error('Auth not initialized');

      try {
        return await firebaseCreateUser(this.auth, email, password);
      } catch (error) {
        const processed = handleFirebaseError(error, 'createUserWithEmailPassword');
        throw new Error(processed.message);
      }
    });
  }

  /**
   * Sign out the current user
   * @returns Promise that resolves when sign out is complete
   */
  public async signOut(): Promise<void> {
    return this.executeWithInitGuard(async () => {
      if (!this.auth) throw new Error('Auth not initialized');

      try {
        return await firebaseSignOut(this.auth);
      } catch (error) {
        const processed = handleFirebaseError(error, 'signOut');
        throw new Error(processed.message);
      }
    });
  }

  /**
   * Send password reset email to the specified email address
   * @param email User email
   * @returns Promise that resolves when the email has been sent
   */
  public async sendPasswordResetEmail(email: string): Promise<void> {
    return this.executeWithInitGuard(async () => {
      if (!this.auth) throw new Error('Auth not initialized');

      try {
        return await firebaseSendPasswordResetEmail(this.auth, email);
      } catch (error) {
        const processed = handleFirebaseError(error, 'sendPasswordResetEmail');
        throw new Error(processed.message);
      }
    });
  }

  /**
   * Get Firestore document by reference
   * @param collectionName Collection name
   * @param docId Document ID
   * @returns Promise with document data or null
   */
  public async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    return this.executeWithInitGuard(async () => {
      if (!this.db) throw new Error('Firestore not initialized');

      try {
        const docRef = doc(this.db, collectionName, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as T;
        } else {
          return null;
        }
      } catch (error) {
        const processed = handleFirebaseError(error, `getDocument:${collectionName}`);
        throw new Error(processed.message);
      }
    });
  }

  /**
   * Set Firestore document data
   * @param collectionName Collection name
   * @param docId Document ID
   * @param data Document data
   * @returns Promise that resolves when operation is complete
   */
  public async setDocument<T extends Record<string, any>>(
    collectionName: string,
    docId: string,
    data: T
  ): Promise<void> {
    return this.executeWithInitGuard(async () => {
      if (!this.db) throw new Error('Firestore not initialized');

      try {
        const docRef = doc(this.db, collectionName, docId);
        await setDoc(docRef, data as any);
      } catch (error) {
        const processed = handleFirebaseError(error, `setDocument:${collectionName}`);
        throw new Error(processed.message);
      }
    });
  }

  /**
   * Get all documents from a collection
   * @param collectionName Collection name
   * @returns Promise with array of documents
   */
  public async getCollection<T>(collectionName: string): Promise<T[]> {
    return this.executeWithInitGuard(async () => {
      if (!this.db) throw new Error('Firestore not initialized');

      try {
        const collectionRef = collection(this.db, collectionName);
        const querySnapshot = await getDocs(collectionRef);

        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
      } catch (error) {
        const processed = handleFirebaseError(error, `getCollection:${collectionName}`);
        throw new Error(processed.message);
      }
    });
  }

  /**
   * Query documents by field value
   * @param collectionName Collection name
   * @param field Field to query
   * @param value Value to match
   * @returns Promise with array of matching documents
   */
  public async queryByField<T>(collectionName: string, field: string, value: any): Promise<T[]> {
    return this.executeWithInitGuard(async () => {
      if (!this.db) throw new Error('Firestore not initialized');

      try {
        const collectionRef = collection(this.db, collectionName);
        const q = query(collectionRef, where(field, '==', value));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
      } catch (error) {
        const processed = handleFirebaseError(error, `queryByField:${collectionName}`);
        throw new Error(processed.message);
      }
    });
  }
}

// Create and export a singleton instance
const firebaseService = new FirebaseService();
export default firebaseService;

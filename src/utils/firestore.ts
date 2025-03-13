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
  Firestore,
} from 'firebase/firestore';
import { db } from './firebase';
import { Property, User, Message, Favorite } from './firebase';

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

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
  };
};

// Properties Collection
let propertiesCollection: CollectionReference | undefined;
let usersCollection: CollectionReference | undefined;
let messagesCollection: CollectionReference | undefined;
let favoritesCollection: CollectionReference | undefined;

// Initialize collections if db is available
if (db) {
  propertiesCollection = collection(db, 'properties');
  usersCollection = collection(db, 'users');
  messagesCollection = collection(db, 'messages');
  favoritesCollection = collection(db, 'favorites');
}

// Helper function to check if Firestore is available
const checkFirestore = () => {
  if (!isClient || !db) {
    throw new Error('Firestore is not available. This operation can only be performed on the client side.');
  }
};

// Get all properties
export const getAllProperties = async (): Promise<Property[]> => {
  checkFirestore();
  if (!propertiesCollection) throw new Error('Firestore is not initialized');
  
  const snapshot = await getDocs(propertiesCollection);
  return snapshot.docs.map(convertPropertyDoc);
};

// Get featured properties
export const getFeaturedProperties = async (limitCount = 6): Promise<Property[]> => {
  checkFirestore();
  if (!propertiesCollection) throw new Error('Firestore is not initialized');
  
  const q = query(
    propertiesCollection,
    where('isFeatured', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(convertPropertyDoc);
};

// Get new properties
export const getNewProperties = async (limitCount = 3): Promise<Property[]> => {
  checkFirestore();
  if (!propertiesCollection) throw new Error('Firestore is not initialized');
  
  const q = query(
    propertiesCollection,
    where('isNew', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(convertPropertyDoc);
};

// Get property by ID
export const getPropertyById = async (id: string): Promise<Property | null> => {
  checkFirestore();
  if (!db) throw new Error('Firestore is not initialized');
  
  const docRef = doc(db, 'properties', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: timestampToDate(docSnap.data().createdAt),
    } as Property;
  }
  
  return null;
};

// Get properties by type
export const getPropertiesByType = async (type: string): Promise<Property[]> => {
  checkFirestore();
  if (!propertiesCollection) throw new Error('Firestore is not initialized');
  
  const q = query(
    propertiesCollection,
    where('propertyType', '==', type),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(convertPropertyDoc);
};

// Get properties by user ID
export const getPropertiesByUserId = async (userId: string): Promise<Property[]> => {
  checkFirestore();
  if (!propertiesCollection) throw new Error('Firestore is not initialized');
  
  const q = query(
    propertiesCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(convertPropertyDoc);
};

// Add a new property
export const addProperty = async (property: Omit<Property, 'id' | 'createdAt'>): Promise<string> => {
  checkFirestore();
  if (!propertiesCollection) throw new Error('Firestore is not initialized');
  
  const docRef = await addDoc(propertiesCollection, {
    ...property,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Update a property
export const updateProperty = async (id: string, property: Partial<Property>): Promise<void> => {
  checkFirestore();
  if (!db) throw new Error('Firestore is not initialized');
  
  const propertyRef = doc(db, 'properties', id);
  await updateDoc(propertyRef, {
    ...property,
    updatedAt: serverTimestamp(),
  });
};

// Delete a property
export const deleteProperty = async (id: string): Promise<void> => {
  checkFirestore();
  if (!db) throw new Error('Firestore is not initialized');
  
  const propertyRef = doc(db, 'properties', id);
  await deleteDoc(propertyRef);
};

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  checkFirestore();
  if (!db) throw new Error('Firestore is not initialized');
  
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: timestampToDate(docSnap.data().createdAt),
    } as User;
  }
  
  return null;
};

// Add a new user
export const addUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<string> => {
  checkFirestore();
  if (!usersCollection) throw new Error('Firestore is not initialized');
  
  const docRef = await addDoc(usersCollection, {
    ...user,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Update a user
export const updateUser = async (id: string, user: Partial<User>): Promise<void> => {
  checkFirestore();
  if (!db) throw new Error('Firestore is not initialized');
  
  const userRef = doc(db, 'users', id);
  await updateDoc(userRef, {
    ...user,
    updatedAt: serverTimestamp(),
  });
};

// Get messages by property ID
export const getMessagesByPropertyId = async (propertyId: string): Promise<Message[]> => {
  checkFirestore();
  if (!messagesCollection) throw new Error('Firestore is not initialized');
  
  const q = query(
    messagesCollection,
    where('propertyId', '==', propertyId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: timestampToDate(doc.data().createdAt),
  })) as Message[];
};

// Get messages by user ID (sent or received)
export const getMessagesByUserId = async (userId: string): Promise<Message[]> => {
  checkFirestore();
  if (!messagesCollection) throw new Error('Firestore is not initialized');
  
  const q = query(
    messagesCollection,
    where('senderId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  
  const q2 = query(
    messagesCollection,
    where('recipientId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot2 = await getDocs(q2);
  
  const messages = [
    ...snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: timestampToDate(doc.data().createdAt),
    })),
    ...snapshot2.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: timestampToDate(doc.data().createdAt),
    })),
  ] as Message[];
  
  // Sort by createdAt in descending order
  return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

// Add a new message
export const addMessage = async (message: Omit<Message, 'id' | 'createdAt'>): Promise<string> => {
  checkFirestore();
  if (!messagesCollection) throw new Error('Firestore is not initialized');
  
  const docRef = await addDoc(messagesCollection, {
    ...message,
    createdAt: serverTimestamp(),
    read: false,
  });
  return docRef.id;
};

// Mark message as read
export const markMessageAsRead = async (id: string): Promise<void> => {
  checkFirestore();
  if (!db) throw new Error('Firestore is not initialized');
  
  const messageRef = doc(db, 'messages', id);
  await updateDoc(messageRef, {
    read: true,
  });
};

// Get favorites by user ID
export const getFavoritesByUserId = async (userId: string): Promise<Favorite[]> => {
  checkFirestore();
  if (!favoritesCollection) throw new Error('Firestore is not initialized');
  
  const q = query(
    favoritesCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: timestampToDate(doc.data().createdAt),
  })) as Favorite[];
};

// Add a favorite
export const addFavorite = async (favorite: Omit<Favorite, 'id' | 'createdAt'>): Promise<string> => {
  checkFirestore();
  if (!favoritesCollection) throw new Error('Firestore is not initialized');
  
  const docRef = await addDoc(favoritesCollection, {
    ...favorite,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Remove a favorite
export const removeFavorite = async (id: string): Promise<void> => {
  checkFirestore();
  if (!db) throw new Error('Firestore is not initialized');
  
  const favoriteRef = doc(db, 'favorites', id);
  await deleteDoc(favoriteRef);
};

// Check if property is favorited by user
export const isPropertyFavorited = async (userId: string, propertyId: string): Promise<boolean> => {
  checkFirestore();
  if (!favoritesCollection) throw new Error('Firestore is not initialized');
  
  const q = query(
    favoritesCollection,
    where('userId', '==', userId),
    where('propertyId', '==', propertyId),
    limit(1)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

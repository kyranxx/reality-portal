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
} from 'firebase/firestore';
import { db } from './firebase';
import { Property, User, Message, Favorite } from './firebase';

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
export const propertiesCollection = collection(db, 'properties');

// Get all properties
export const getAllProperties = async (): Promise<Property[]> => {
  const snapshot = await getDocs(propertiesCollection);
  return snapshot.docs.map(convertPropertyDoc);
};

// Get featured properties
export const getFeaturedProperties = async (limitCount = 6): Promise<Property[]> => {
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
  const docRef = await addDoc(propertiesCollection, {
    ...property,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Update a property
export const updateProperty = async (id: string, property: Partial<Property>): Promise<void> => {
  const propertyRef = doc(db, 'properties', id);
  await updateDoc(propertyRef, {
    ...property,
    updatedAt: serverTimestamp(),
  });
};

// Delete a property
export const deleteProperty = async (id: string): Promise<void> => {
  const propertyRef = doc(db, 'properties', id);
  await deleteDoc(propertyRef);
};

// Users Collection
export const usersCollection = collection(db, 'users');

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
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
  const docRef = await addDoc(usersCollection, {
    ...user,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Update a user
export const updateUser = async (id: string, user: Partial<User>): Promise<void> => {
  const userRef = doc(db, 'users', id);
  await updateDoc(userRef, {
    ...user,
    updatedAt: serverTimestamp(),
  });
};

// Messages Collection
export const messagesCollection = collection(db, 'messages');

// Get messages by property ID
export const getMessagesByPropertyId = async (propertyId: string): Promise<Message[]> => {
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
  const docRef = await addDoc(messagesCollection, {
    ...message,
    createdAt: serverTimestamp(),
    read: false,
  });
  return docRef.id;
};

// Mark message as read
export const markMessageAsRead = async (id: string): Promise<void> => {
  const messageRef = doc(db, 'messages', id);
  await updateDoc(messageRef, {
    read: true,
  });
};

// Favorites Collection
export const favoritesCollection = collection(db, 'favorites');

// Get favorites by user ID
export const getFavoritesByUserId = async (userId: string): Promise<Favorite[]> => {
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
  const docRef = await addDoc(favoritesCollection, {
    ...favorite,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Remove a favorite
export const removeFavorite = async (id: string): Promise<void> => {
  const favoriteRef = doc(db, 'favorites', id);
  await deleteDoc(favoriteRef);
};

// Check if property is favorited by user
export const isPropertyFavorited = async (userId: string, propertyId: string): Promise<boolean> => {
  const q = query(
    favoritesCollection,
    where('userId', '==', userId),
    where('propertyId', '==', propertyId),
    limit(1)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

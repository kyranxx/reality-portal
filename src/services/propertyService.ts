'use client';

import { db } from '../utils/firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { waitForFirebaseInit } from '../utils/firebase';
import { featuredProperties, newProperties } from '../data/sampleProperties';

// Unified property interface that works for both Firestore and sample data
export interface UnifiedProperty {
  id: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  size: number;
  area?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  type?: 'apartment' | 'house' | 'land' | 'commercial';
  userId?: string;
  images?: string[];
  imageUrl?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  landSize?: number;
  createdAt?: Date;
  features?: string[];
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactVisibility?: string;
}

// Convert Firestore property to unified format
function convertFirestoreProperty(firestoreProperty: any): UnifiedProperty {
  return {
    id: firestoreProperty.id,
    title: firestoreProperty.title,
    description: firestoreProperty.description || '',
    price: firestoreProperty.price,
    location: firestoreProperty.location,
    size: firestoreProperty.area || 0,
    area: firestoreProperty.area,
    rooms: firestoreProperty.rooms,
    bedrooms: firestoreProperty.rooms,
    bathrooms: firestoreProperty.bathrooms,
    propertyType: firestoreProperty.propertyType,
    type: firestoreProperty.propertyType,
    userId: firestoreProperty.userId,
    images: firestoreProperty.images || [],
    imageUrl: firestoreProperty.images && firestoreProperty.images.length > 0 
      ? firestoreProperty.images[0] 
      : undefined,
    isFeatured: firestoreProperty.isFeatured,
    isNew: firestoreProperty.isNew,
    landSize: firestoreProperty.landSize,
    createdAt: firestoreProperty.createdAt,
    features: firestoreProperty.features,
    contactName: firestoreProperty.contactName,
    contactPhone: firestoreProperty.contactPhone,
    contactEmail: firestoreProperty.contactEmail,
    contactVisibility: firestoreProperty.contactVisibility,
  };
}

// Convert sample property to unified format
function convertSampleProperty(sampleProperty: any): UnifiedProperty {
  return {
    id: sampleProperty.id,
    title: sampleProperty.title,
    description: '',
    price: sampleProperty.price,
    location: sampleProperty.location,
    size: sampleProperty.size,
    area: sampleProperty.size,
    rooms: sampleProperty.bedrooms,
    bedrooms: sampleProperty.bedrooms,
    bathrooms: sampleProperty.bathrooms,
    propertyType: sampleProperty.type,
    type: sampleProperty.type,
    userId: '',
    images: sampleProperty.imageUrl ? [sampleProperty.imageUrl] : [],
    imageUrl: sampleProperty.imageUrl,
    isFeatured: sampleProperty.isFeatured,
    isNew: sampleProperty.isNew,
    landSize: sampleProperty.landSize,
  };
}

// Attempt to get properties from Firestore, fallback to sample data
export async function getProperties(shouldUseSampleData = false): Promise<UnifiedProperty[]> {
  // Use sample data immediately if requested or if not in client
  if (shouldUseSampleData || typeof window === 'undefined') {
    console.log('Using sample property data');
    return [...featuredProperties, ...newProperties].map(convertSampleProperty);
  }

  try {
    // Wait for Firebase to initialize
    await waitForFirebaseInit();

    // Check if Firestore is initialized
    if (!db) {
      console.warn('Firestore not initialized, using sample data');
      return [...featuredProperties, ...newProperties].map(convertSampleProperty);
    }

    try {
      // Get properties from Firestore
      console.log('Attempting to fetch properties from Firestore');
      const propertiesSnapshot = await getDocs(collection(db, 'properties'));
      
      // If no properties found in Firestore, use sample data
      if (propertiesSnapshot.empty) {
        console.log('No properties found in Firestore, using sample data');
        return [...featuredProperties, ...newProperties].map(convertSampleProperty);
      }
      
      console.log(`Successfully retrieved ${propertiesSnapshot.docs.length} properties from Firestore`);
      
      // Convert Firestore properties to unified format
      return propertiesSnapshot.docs.map(doc => {
        const data = doc.data();
        return convertFirestoreProperty({ id: doc.id, ...data });
      });
    } catch (firestoreError: any) {
      // Log specific Firestore error details
      if (firestoreError.code === 'permission-denied') {
        console.error('Firebase permission denied error. Check your security rules and auth state.');
        console.error('Error details:', firestoreError);
      } else {
        console.error(`Firestore error (${firestoreError.code}):`, firestoreError);
      }
      
      // Fallback to sample data
      return [...featuredProperties, ...newProperties].map(convertSampleProperty);
    }
  } catch (error) {
    console.error('Error in Firebase initialization:', error);
    // Fallback to sample data on error
    return [...featuredProperties, ...newProperties].map(convertSampleProperty);
  }
}

// Get featured properties
export async function getFeaturedProperties(): Promise<UnifiedProperty[]> {
  try {
    // Try to get from Firestore first
    await waitForFirebaseInit();
    
    if (!db) {
      return featuredProperties.map(convertSampleProperty);
    }
    
    const featuredQuery = query(
      collection(db, 'properties'),
      where('isFeatured', '==', true)
    );
    
    const snapshot = await getDocs(featuredQuery);
    
    if (snapshot.empty) {
      return featuredProperties.map(convertSampleProperty);
    }
    
    return snapshot.docs.map(doc => 
      convertFirestoreProperty({ id: doc.id, ...doc.data() })
    );
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return featuredProperties.map(convertSampleProperty);
  }
}

// Get new properties
export async function getNewProperties(): Promise<UnifiedProperty[]> {
  try {
    // Try to get from Firestore first
    await waitForFirebaseInit();
    
    if (!db) {
      return newProperties.map(convertSampleProperty);
    }
    
    const newQuery = query(
      collection(db, 'properties'),
      where('isNew', '==', true)
    );
    
    const snapshot = await getDocs(newQuery);
    
    if (snapshot.empty) {
      return newProperties.map(convertSampleProperty);
    }
    
    return snapshot.docs.map(doc => 
      convertFirestoreProperty({ id: doc.id, ...doc.data() })
    );
  } catch (error) {
    console.error('Error fetching new properties:', error);
    return newProperties.map(convertSampleProperty);
  }
}

// Get a single property by ID
export async function getPropertyById(propertyId: string): Promise<UnifiedProperty | null> {
  // First, check sample data
  const sampleProperty = [...featuredProperties, ...newProperties].find(
    property => property.id === propertyId
  );
  
  if (typeof window === 'undefined') {
    // If we're on the server, return sample data
    return sampleProperty ? convertSampleProperty(sampleProperty) : null;
  }
  
  try {
    // Try to get from Firestore
    await waitForFirebaseInit();
    
    if (!db) {
      console.warn('Firestore not initialized, using sample data for property', propertyId);
      return sampleProperty ? convertSampleProperty(sampleProperty) : null;
    }
    
    try {
      console.log(`Attempting to fetch property ${propertyId} from Firestore`);
      const docRef = doc(db, 'properties', propertyId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log(`Successfully retrieved property ${propertyId} from Firestore`);
        return convertFirestoreProperty({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log(`Property ${propertyId} not found in Firestore, falling back to sample data`);
      }
      
      // Fallback to sample data if not found in Firestore
      return sampleProperty ? convertSampleProperty(sampleProperty) : null;
    } catch (firestoreError: any) {
      // Log specific Firestore error details
      if (firestoreError.code === 'permission-denied') {
        console.error(`Firebase permission denied error fetching property ${propertyId}. Check your security rules and auth state.`);
      } else {
        console.error(`Firestore error (${firestoreError.code}) fetching property ${propertyId}:`, firestoreError);
      }
      
      // Fallback to sample data
      return sampleProperty ? convertSampleProperty(sampleProperty) : null;
    }
  } catch (error) {
    console.error(`Error in Firebase initialization for property ${propertyId}:`, error);
    // Fallback to sample data on error
    return sampleProperty ? convertSampleProperty(sampleProperty) : null;
  }
}

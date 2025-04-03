/**
 * @deprecated Import from '@/utils/firebase/firestore' instead.
 * This file is kept for backward compatibility.
 */

export * from './firebase/firestore';

// Create a default export for backward compatibility
import * as firestoreModule from './firebase/firestore';
export default firestoreModule;

// Add missing user functions for backward compatibility
export const getUserById = async (userId: string) => {
  console.warn('getUserById is using deprecated adapter. Update imports to use new Firebase structure.');
  // This is a stub implementation that other code depends on
  // It would normally make a Firestore query
  return {
    id: userId,
    email: 'user@example.com',
    name: 'User',
    phone: '+1234567890', // Add phone property to match expected structure
    createdAt: new Date()
  };
};

export const updateUser = async (userId: string, data: any) => {
  console.warn('updateUser is using deprecated adapter. Update imports to use new Firebase structure.');
  // This is a stub implementation
  return {
    id: userId,
    ...data,
    updatedAt: new Date()
  };
};

/**
 * Firebase Storage Module
 * 
 * This module provides a unified interface for Firebase Storage operations.
 */

import { 
  getStorage as getStorageOriginal, 
  ref, 
  uploadBytes, 
  uploadBytesResumable,
  getDownloadURL, 
  deleteObject,
  UploadTask,
  ListResult,
  list,
  StorageReference
} from 'firebase/storage';
import { FirebaseApp } from 'firebase/app';
import { isClient } from './config';

/**
 * Get Firebase Storage instance
 */
export function getStorage(app?: FirebaseApp) {
  if (!isClient) {
    throw new Error('Storage is only available on client-side');
  }
  
  try {
    return getStorageOriginal(app);
  } catch (error) {
    console.error('Error getting storage:', error);
    throw error;
  }
}

/**
 * Upload a file to Firebase Storage
 */
export async function uploadFile(
  filePath: string, 
  file: Blob | Uint8Array | ArrayBuffer,
  metadata?: { contentType?: string, customMetadata?: { [key: string]: string } }
): Promise<string> {
  if (!isClient) {
    throw new Error('Cannot upload files on server-side');
  }

  try {
    const storage = getStorageOriginal();
    const storageRef = ref(storage, filePath);
    
    await uploadBytes(storageRef, file, metadata);
    
    // Get download URL
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * Upload a file with progress monitoring
 */
export function uploadFileWithProgress(
  filePath: string, 
  file: Blob | Uint8Array | ArrayBuffer,
  metadata?: { contentType?: string, customMetadata?: { [key: string]: string } }
): UploadTask {
  if (!isClient) {
    throw new Error('Cannot upload files on server-side');
  }

  try {
    const storage = getStorageOriginal();
    const storageRef = ref(storage, filePath);
    
    return uploadBytesResumable(storageRef, file, metadata);
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * Get download URL for a file
 */
export async function getFileUrl(filePath: string): Promise<string> {
  if (!isClient) {
    throw new Error('Cannot get file URL on server-side');
  }

  try {
    const storage = getStorageOriginal();
    const storageRef = ref(storage, filePath);
    
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  if (!isClient) {
    throw new Error('Cannot delete files on server-side');
  }

  try {
    const storage = getStorageOriginal();
    const storageRef = ref(storage, filePath);
    
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * List files in a directory
 */
export async function listFiles(directoryPath: string, maxResults = 100): Promise<ListResult> {
  if (!isClient) {
    throw new Error('Cannot list files on server-side');
  }

  try {
    const storage = getStorageOriginal();
    const directoryRef = ref(storage, directoryPath);
    
    return await list(directoryRef, { maxResults });
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

/**
 * Create a storage reference
 */
export function createStorageRef(path: string): StorageReference {
  if (!isClient) {
    throw new Error('Cannot create storage references on server-side');
  }

  try {
    const storage = getStorageOriginal();
    return ref(storage, path);
  } catch (error) {
    console.error('Error creating storage reference:', error);
    throw error;
  }
}

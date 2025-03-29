/**
 * Image Utilities for handling various image URL formats
 * and providing fallbacks when Firebase Storage is unavailable
 */

// Load fallback path from env
const DEFAULT_FALLBACK = '/images/placeholder.jpg';
const FALLBACK_PATH = process.env.NEXT_PUBLIC_IMAGE_FALLBACK_PATH || DEFAULT_FALLBACK;

// Sample images for development use when Firebase is not available
const SAMPLE_IMAGES = {
  apartments: [
    '/images/samples/apartment-1.jpg',
    '/images/samples/apartment-2.jpg',
    '/images/samples/apartment-3.jpg',
  ],
  houses: [
    '/images/samples/house-1.jpg',
    '/images/samples/house-2.jpg',
    '/images/samples/house-3.jpg',
  ],
  lands: [
    '/images/samples/land-1.jpg',
    '/images/samples/land-2.jpg',
    '/images/samples/land-3.jpg',
  ],
  commercial: [
    '/images/samples/commercial-1.jpg',
    '/images/samples/commercial-2.jpg',
    '/images/samples/commercial-3.jpg',
  ],
};

/**
 * Get a random sample image based on property type
 * @param type Property type
 * @returns Local image URL
 */
export const getSampleImage = (type: 'apartment' | 'house' | 'land' | 'commercial' = 'house'): string => {
  let category: keyof typeof SAMPLE_IMAGES;
  
  switch(type) {
    case 'apartment':
      category = 'apartments';
      break;
    case 'house':
      category = 'houses';
      break;
    case 'land':
      category = 'lands'; 
      break;
    case 'commercial':
      category = 'commercial';
      break;
    default:
      category = 'houses';
  }
  
  // Get sample images for this category
  const images = SAMPLE_IMAGES[category];
  
  // Choose a random image
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

import { StaticImageData } from 'next/image';

/**
 * Convert any image source to a string URL
 * @param src Any image source (string, StaticImageData, etc.)
 * @returns String URL
 */
export const imageSourceToString = (src: string | StaticImageData | null | undefined): string | null | undefined => {
  if (!src) return src;
  
  // Handle static image data objects
  if (typeof src === 'object' && 'src' in src) {
    return src.src;
  }
  
  // Already a string
  return src as string;
};

/**
 * Process a Firebase Storage URL for better compatibility
 * @param url Original URL
 * @returns Processed URL with appropriate access parameters
 */
export const processFirebaseStorageUrl = (url: string | undefined | null): string => {
  // Handle undefined/null URL
  if (!url) return FALLBACK_PATH;
  
  // Check if it's a Firebase Storage URL
  if (url.includes('firebasestorage.googleapis.com')) {
    // If the URL doesn't have an access token or alt=media parameter, add it
    if (!url.includes('token=') && !url.includes('alt=media')) {
      // Strip existing query parameters if any
      const baseUrl = url.split('?')[0];
      // Add alt=media for public access
      return `${baseUrl}?alt=media`;
    }
  }
  
  return url;
};

/**
 * Get appropriate image URL with fallbacks
 * @param url Original image URL
 * @param type Optional property type for fallback selection
 * @param useLocalFallbacks Whether to use local fallbacks
 * @returns Processed image URL
 */
export const getImageUrl = (
  url: string | StaticImageData | undefined | null, 
  type?: 'apartment' | 'house' | 'land' | 'commercial',
  useLocalFallbacks: boolean = process.env.NEXT_PUBLIC_USE_LOCAL_FALLBACKS === 'true'
): string => {
  // Convert to string URL
  const urlString = imageSourceToString(url);
  
  // Use local fallbacks in development when configured
  if ((!urlString || (urlString && urlString.includes('firebasestorage.googleapis.com'))) && useLocalFallbacks) {
    return type ? getSampleImage(type) : FALLBACK_PATH;
  }
  
  // For Firebase Storage URLs, process them for public access
  if (urlString && urlString.includes('firebasestorage.googleapis.com')) {
    return processFirebaseStorageUrl(urlString);
  }
  
  // Return the URL as is if it's not a Firebase Storage URL and not empty
  return urlString || FALLBACK_PATH;
};

export default {
  getImageUrl,
  getSampleImage,
  processFirebaseStorageUrl,
  FALLBACK_PATH,
};

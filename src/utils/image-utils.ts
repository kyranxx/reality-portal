/**
 * Image Utilities for handling various image URL formats
 * and providing fallbacks when resources are unavailable
 */

// Load fallback path from env
const DEFAULT_FALLBACK = '/images/placeholder.jpg';
const FALLBACK_PATH = process.env.NEXT_PUBLIC_IMAGE_FALLBACK_PATH || DEFAULT_FALLBACK;

// Sample images for development use
const SAMPLE_IMAGES = {
  apartments: [
    '/images/samples/apartments/apartment-1.svg', 
    '/images/samples/apartment-1.jpg'
  ],
  houses: [
    '/images/samples/houses/house-1.svg',
    '/images/samples/house-1.jpg'
  ],
  lands: [
    '/images/samples/land/land-1.svg',
    '/images/samples/land-1.jpg'
  ],
  commercial: [
    '/images/samples/commercial/commercial-1.svg',
    '/images/samples/commercial-1.jpg'
  ],
};

// Enable local fallbacks by default during development
const USE_LOCAL_FALLBACKS = process.env.NEXT_PUBLIC_USE_LOCAL_FALLBACKS === 'true';

/**
 * Get a sample image based on property type
 * @param type Property type
 * @returns Local image URL
 */
export const getSampleImage = (type: 'apartment' | 'house' | 'land' | 'commercial' = 'house'): string => {
  try {
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
    
    // If no images in the category, return a fallback
    if (!images || images.length === 0) {
      console.warn(`No sample images found for ${category}, using default fallback`);
      return '/images/placeholder.jpg';
    }
    
    // Find first jpg image if available, otherwise use the first image
    const jpgImage = images.find(img => img.endsWith('.jpg'));
    return jpgImage || images[0];
  } catch (error) {
    console.warn('Error getting sample image, using fallback', error);
    return '/images/samples/apartment-1.svg';
  }
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
  if (!url) return '/images/placeholder.jpg';
  
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
  useLocalFallbacks: boolean = USE_LOCAL_FALLBACKS
): string => {
  // Convert to string URL
  const urlString = imageSourceToString(url);
  
  // Always use local fallbacks if configured to do so in .env.local
  if (useLocalFallbacks) {
    return type ? getSampleImage(type) : '/images/placeholder.jpg';
  }
  
  // Handle empty URLs with sample images
  if (!urlString) {
    return type ? getSampleImage(type) : '/images/placeholder.jpg';
  }
  
  // For Firebase Storage URLs, process them for public access
  if (urlString && urlString.includes('firebasestorage.googleapis.com')) {
    return processFirebaseStorageUrl(urlString);
  }
  
  // Return the URL as is if it's not a Firebase Storage URL and not empty
  return urlString;
};

export default {
  getImageUrl,
  getSampleImage,
  processFirebaseStorageUrl,
  FALLBACK_PATH,
};

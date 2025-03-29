import React from 'react';
import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/image-utils';
import { StaticImageData } from 'next/image';

/**
 * Safe Image component that handles loading errors gracefully
 * Provides fallback to local placeholder when remote images fail to load
 */
export default function SafeImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  propertyType,
  ...props
}: ImageProps & { 
  fallbackSrc?: string;
  propertyType?: 'apartment' | 'house' | 'land' | 'commercial';
}) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);
  
  // Process source URLs to handle various formats
  useEffect(() => {
    // Return immediately if we've already set a fallback due to error
    if (error) return;
    
    // Process the source URL with our utility
    try {
      // Cast the src to the correct type that getImageUrl expects
      const processedSrc = getImageUrl(src as (string | StaticImageData | undefined | null), propertyType);
      setImgSrc(processedSrc);
    } catch (err) {
      console.error('Error processing image URL:', err);
      setImgSrc(fallbackSrc);
      setError(true);
    }
  }, [src, propertyType, error, fallbackSrc]);

  // Handle image load error by using fallback
  const handleError = () => {
    if (!error) {
      console.log(`Image failed to load: ${src}, using fallback`);
      setImgSrc(fallbackSrc);
      setError(true);
    }
  };

  // Don't render anything until we have a source URL
  if (!imgSrc) return null;

  return <Image {...props} src={imgSrc} alt={alt || 'Image'} onError={handleError} />;
}

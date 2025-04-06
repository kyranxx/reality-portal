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
  const [isSvg, setIsSvg] = useState(false);
  
  // Process source URLs to handle various formats
  useEffect(() => {
    // Reset state for new src
    if (src !== imgSrc && !error) {
      setError(false);
    }
    
    // Check if source is an SVG to handle it specially
    const srcString = String(src);
    if (srcString.endsWith('.svg') || (typeof src === 'string' && srcString.includes('<svg'))) {
      setIsSvg(true);
      
      // For SVG files, fallback to placeholder.jpg immediately to avoid rendering issues
      if (srcString === '/images/logo.svg' || !srcString.includes('/images/samples/')) {
        console.log('SVG detected, using placeholder:', srcString);
        setImgSrc('/images/placeholder.jpg');
        return;
      }
    }
    
    // Process the source URL with our utility
    try {
      // Use the sample images or placeholder for safety
      if (propertyType) {
        // Get the appropriate sample image based on property type
        const sampleImage = `/images/samples/${propertyType}-1.jpg`;
        console.log('Using sample image for property type:', sampleImage);
        setImgSrc(sampleImage);
      } else {
        // Process the source URL with our utility
        const processedSrc = getImageUrl(src as (string | StaticImageData | undefined | null), propertyType);
        setImgSrc(processedSrc);
      }
    } catch (err) {
      console.error('Error processing image URL:', err);
      setImgSrc(fallbackSrc);
      setError(true);
    }
  }, [src, propertyType, error, fallbackSrc, imgSrc]);

  // Handle image load error
  const handleError = () => {
    console.log('Image load error for:', imgSrc);
    if (error) return; // Already in error state
    
    // Always use fallback for errors
    setImgSrc('/images/placeholder.jpg');
    setError(true);
  };

  // Don't render anything until we have a source URL
  if (!imgSrc) {
    return (
      <div className={props.className as string} style={{
        background: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '14px',
        ...(props.style as React.CSSProperties)
      }}>
        Loading...
      </div>
    );
  }

  // For SVGs that have loading issues with Next.js Image component, use img tag directly
  if (isSvg) {
    return (
      <div className={props.className as string} style={{
        background: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        ...(props.style as React.CSSProperties)
      }}>
        {alt || 'Image'}
      </div>
    );
  }

  return <Image {...props} src={imgSrc} alt={alt || 'Image'} onError={handleError} />;
}

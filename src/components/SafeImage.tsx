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
  fallbackSrc = '/images/samples/apartment-1.svg',
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
    }
    
    // Process the source URL with our utility
    try {
      // Cast the src to the correct type that getImageUrl expects
      const processedSrc = getImageUrl(src as (string | StaticImageData | undefined | null), propertyType, true);
      setImgSrc(processedSrc);
    } catch (err) {
      console.error('Error processing image URL:', err);
      setImgSrc(fallbackSrc);
      setError(true);
    }
  }, [src, propertyType, error, fallbackSrc, imgSrc]);

  // Handle image load error
  const handleError = () => {
    if (error) return; // Already in error state
    
    // For SVG files, use special handling
    if (isSvg) {
      // If this is a local SVG, try to use it directly
      if (typeof src === 'string' && (src.startsWith('/') || src.startsWith('./') || src.startsWith('../'))) {
        setImgSrc(src);
        return; // Try with direct path first
      }
    }
    
    // Use fallback
    setImgSrc(fallbackSrc);
    setError(true);
  };

  // Don't render anything until we have a source URL
  if (!imgSrc) return null;

  // For SVGs that have loading issues with Next.js Image component, use img tag directly
  if (isSvg) {
    return <img src={imgSrc} alt={alt || 'Image'} className={props.className as string} style={props.style as React.CSSProperties} />;
  }

  return <Image {...props} src={imgSrc} alt={alt || 'Image'} onError={handleError} />;
}

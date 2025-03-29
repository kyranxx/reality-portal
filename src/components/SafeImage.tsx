import React from 'react';
import Image, { ImageProps } from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { getImageUrl } from '../utils/image-utils';
import { StaticImageData } from 'next/image';

// For SVG content detection
const SVG_PATTERN = /^<svg|^<\?xml.*?<svg/i;

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
  const retryCount = useRef(0);
  const maxRetries = 2;
  
  // Process source URLs to handle various formats
  useEffect(() => {
    // Reset state for new src
    if (src !== imgSrc && !error) {
      retryCount.current = 0;
    }
    
    // Return immediately if we've already set a fallback due to error
    if (error) return;
    
    // Check if source is an SVG to handle it specially
    const srcString = String(src);
    if (srcString.endsWith('.svg') || (typeof src === 'string' && SVG_PATTERN.test(src))) {
      setIsSvg(true);
    }
    
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
  }, [src, propertyType, error, fallbackSrc, imgSrc]);

  // Handle image load error by using fallback with retry logic
  const handleError = () => {
    if (error) return; // Already in error state
    
    // Increment retry counter
    retryCount.current += 1;
    
    // For SVG files, use special handling to avoid Next.js optimization issues
    if (isSvg) {
      console.warn(`SVG image loading issue detected with ${src}, using direct path`);
      // If this is a local SVG, try to use it directly
      if (typeof src === 'string' && (src.startsWith('/') || src.startsWith('./') || src.startsWith('../'))) {
        setImgSrc(src);
        return; // Try with direct path first
      }
    }
    
    // If we haven't exceeded retries, try again with a cache-busting query param
    if (retryCount.current <= maxRetries) {
      console.log(`Retry ${retryCount.current}/${maxRetries} for image: ${src}`);
      
      // Add cache busting if it's a URL
      if (typeof imgSrc === 'string' && (imgSrc.startsWith('http') || imgSrc.startsWith('/'))) {
        const cacheBuster = `?retry=${Date.now()}`;
        const newSrc = imgSrc.includes('?') 
          ? `${imgSrc}&${cacheBuster.substring(1)}` 
          : `${imgSrc}${cacheBuster}`;
        
        setImgSrc(newSrc);
        return;
      }
    }
    
    // If retries exhausted or not applicable, use fallback
    console.warn(`Image failed to load after ${retryCount.current} attempts: ${src}, using fallback`);
    setImgSrc(fallbackSrc);
    setError(true);
  };

  // Don't render anything until we have a source URL
  if (!imgSrc) return null;

  // For SVGs that have loading issues with Next.js Image component, use img tag directly
  if (error && isSvg) {
    return <img src={imgSrc} alt={alt || 'Image'} style={props.style as React.CSSProperties} />;
  }

  return <Image {...props} src={imgSrc} alt={alt || 'Image'} onError={handleError} />;
}

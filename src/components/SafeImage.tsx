'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  attemptReload?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  onErrorCallback?: (error: Error) => void;
}

/**
 * SafeImage component that handles image loading failures with retries and fallbacks
 */
export default function SafeImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.txt',
  attemptReload = true,
  maxRetries = 2,
  retryDelay = 1000,
  onErrorCallback,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0); // Used to force remount

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setRetryCount(0);
    setHasError(false);
    setKey(prev => prev + 1);
  }, [src]);

  // Handle image load errors
  const handleError = (error: any) => {
    console.error(`Image load error for ${currentSrc}:`, error);
    
    if (onErrorCallback) {
      onErrorCallback(new Error(`Failed to load image: ${currentSrc}`));
    }

    // If we can retry and haven't exceeded max retries
    if (attemptReload && retryCount < maxRetries) {
      console.log(`Retrying image load (${retryCount + 1}/${maxRetries})...`);
      
      // Increment retry count
      setRetryCount(prev => prev + 1);
      
      // Wait before retry
      setTimeout(() => {
        // Add cache-busting parameter to URL if it's a string
        if (typeof currentSrc === 'string') {
          // Only add cache buster to URLs, not to imported images
          if (currentSrc.startsWith('http') || currentSrc.startsWith('/')) {
            const cacheBuster = `_cb=${Date.now()}`;
            const separator = currentSrc.includes('?') ? '&' : '?';
            setCurrentSrc(`${currentSrc}${separator}${cacheBuster}`);
          }
        }
        
        // Force remount of Image component
        setKey(prev => prev + 1);
      }, retryDelay);
    } else {
      // Fall back to placeholder after retries exhausted
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <div className="safe-image-container">
      {hasError && (
        <div className="image-load-error-overlay">
          <span className="image-load-error-text">
            {alt || 'Image failed to load'}
          </span>
        </div>
      )}
      <Image
        key={`image-${key}`}
        src={currentSrc}
        alt={alt || 'Image'}
        onError={handleError}
        {...props}
      />
    </div>
  );
}

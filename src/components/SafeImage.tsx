import React from 'react';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

/**
 * Safe Image component that handles loading errors gracefully
 * Provides fallback to local placeholder when remote images fail to load
 */
export default function SafeImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  ...props
}: ImageProps & { fallbackSrc?: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  // Handle image load error by using fallback
  const handleError = () => {
    if (!error) {
      console.log(`Image failed to load: ${src}, using fallback`);
      setImgSrc(fallbackSrc);
      setError(true);
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || 'Image'}
      onError={handleError}
    />
  );
}

'use client';

import { useEffect, useState } from 'react';

interface NoSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A component that prevents server-side rendering of its children.
 * This is useful for components that use browser-only APIs or need to be rendered only on the client.
 */
export default function NoSSR({ 
  children, 
  fallback = <div className="flex justify-center items-center min-h-[200px]">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
      <div className="text-gray-400">Loading...</div>
    </div>
  </div>
}: NoSSRProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

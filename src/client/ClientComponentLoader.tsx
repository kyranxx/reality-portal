'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ClientComponentKey, clientComponentRegistry } from './registry';

interface ClientComponentLoaderProps {
  componentKey: ClientComponentKey;
  fallback?: React.ReactNode;
}

/**
 * A type-safe utility component that loads client components from the registry
 * 
 * Benefits:
 * - Type safety prevents using invalid component keys
 * - No dynamic string imports prevents webpack from trying to include server components
 * - Clear separation between client and server code
 */
export default function ClientComponentLoader({ 
  componentKey, 
  fallback = <div className="flex justify-center items-center min-h-[200px]">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
      <div className="text-gray-400">Loading...</div>
    </div>
  </div>
}: ClientComponentLoaderProps) {
  // Get the component from the registry
  const Component = clientComponentRegistry[componentKey];
  
  // We're using dynamic to ensure the component is loaded only on the client
  const DynamicComponent = dynamic(
    () => Promise.resolve(Component),
    {
      loading: () => <>{fallback}</>,
      // Set SSR to false to ensure component only loads on client side
      ssr: false
    }
  );

  return (
    <Suspense fallback={fallback}>
      <DynamicComponent />
    </Suspense>
  );
}

'use client';

import React, { Suspense } from 'react';
import { CLIENT_COMPONENTS, ClientComponentKey } from './_components';

interface UniversalComponentLoaderProps {
  componentKey: ClientComponentKey;
  fallback?: React.ReactNode;
}

/**
 * A universal client component loader that works in all environments including Vercel production.
 * This component uses direct imports rather than dynamic resolution to ensure maximum compatibility.
 */
export function UniversalComponentLoader({ 
  componentKey, 
  fallback = <div className="flex justify-center items-center min-h-[200px]">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
      <div className="text-gray-400">Loading...</div>
    </div>
  </div>
}: UniversalComponentLoaderProps) {
  // Get the component from the static registry
  const Component = CLIENT_COMPONENTS[componentKey];
  
  if (!Component) {
    console.error(`Component not found for key: ${componentKey}`);
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <p>Error: Component not found. Please check your component key.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
}

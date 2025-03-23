'use client';

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface ClientComponentLoaderProps {
  componentPath: string;
  fallback?: React.ReactNode;
}

/**
 * A utility component that dynamically loads client components
 * This provides better error handling and fallback behavior for client-only components
 */
const ClientComponentLoader = ({ 
  componentPath, 
  fallback = <div className="flex justify-center items-center min-h-[200px]">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
      <div className="text-gray-400">Loading...</div>
    </div>
  </div>
}: ClientComponentLoaderProps) => {
  // Ensure we're only importing client components
  const Component = dynamic(
    () => {
      // Prevent importing layout components or other server components
      if (componentPath.includes('layout') || componentPath.includes('page.tsx')) {
        console.error(`Cannot load server component: ${componentPath}`);
        return Promise.resolve(() => (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            <p>Error: Cannot load server components via ClientComponentLoader.</p>
          </div>
        ));
      }
      
      return import(`@/${componentPath}`).catch(err => {
        console.error(`Failed to load component: ${componentPath}`, err);
        // Return a fallback component on error
        return () => (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            <p>Failed to load component. Please try refreshing the page.</p>
          </div>
        );
      });
    },
    { 
      loading: () => <>{fallback}</>,
      // Set SSR to false to ensure component only loads on client side
      ssr: false
    }
  );

  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
};

export default ClientComponentLoader;

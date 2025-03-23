'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Define the allowed component paths as a type to ensure type safety
type AllowedComponentPath = 
  | 'app/dashboard/DashboardClient'
  | 'app/dashboard/profile/ProfileClient'
  | 'app/admin/AdminClient';

interface ClientComponentLoaderProps {
  componentPath: AllowedComponentPath;
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
  // Define allowed client component paths to prevent accidentally loading server components
  const allowedPaths = {
    // Dashboard components
    'app/dashboard/DashboardClient': () => import('../app/dashboard/DashboardClient'),
    'app/dashboard/profile/ProfileClient': () => import('../app/dashboard/profile/ProfileClient'),
    // Admin components
    'app/admin/AdminClient': () => import('../app/admin/AdminClient'),
  };

  // Use a safer dynamic component loading approach that doesn't use string templates
  const Component = dynamic(
    () => {
      // Check if the path is in the allowed list
      return allowedPaths[componentPath]().catch((err: Error) => {
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

'use client';

import React, { Suspense, lazy } from 'react';
import { CLIENT_COMPONENTS, ClientComponentKey } from './_components';

// Direct static imports for production environment
import HomeClientComponent from './HomeClient';
import DashboardClientComponent from './dashboard/DashboardClient';
import ProfileClientComponent from './dashboard/profile/ProfileClient';
import AdminClientComponent from './admin/AdminClient';

// Fallback components map for static build environments
const STATIC_COMPONENTS = {
  'HomeClient': HomeClientComponent,
  'DashboardClient': DashboardClientComponent, 
  'ProfileClient': ProfileClientComponent,
  'AdminClient': AdminClientComponent,
};

interface UniversalComponentLoaderProps {
  componentKey: ClientComponentKey;
  fallback?: React.ReactNode;
}

/**
 * A universal component loader that works in all environments including Vercel production.
 * This version uses both static and dynamic component resolution to ensure maximum compatibility.
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
  // Try to get component from the static registry first (safest for prerendering)
  const StaticComponent = STATIC_COMPONENTS[componentKey];
  
  // Fall back to dynamic registry for any new components added later
  const DynamicComponent = CLIENT_COMPONENTS[componentKey];
  
  // Choose the first available component
  const Component = StaticComponent || DynamicComponent;
  
  if (!Component) {
    console.error(`Component not found for key: ${componentKey}`);
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <p>Error: Component not found. Please check your component key.</p>
        <p className="text-sm mt-2">Key: {componentKey}</p>
      </div>
    );
  }

  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
}

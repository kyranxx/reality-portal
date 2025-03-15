'use client';

import { Suspense } from 'react';
import { lazy } from 'react';

// Export runtime to use edge runtime
export const runtime = 'edge';

// Completely disable SSR for this component
const ProfileClient = lazy(() => import('./ProfileClient'));

const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
      <div className="text-gray-400">Loading...</div>
    </div>
  </div>
);

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProfileClient />
    </Suspense>
  );
}

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import PropertyPage from '../property-page';
import ServerPropertyProvider from '@/components/ServerPropertyProvider';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Don't statically generate any property pages to avoid Firebase SSG issues
export function generateStaticParams() {
  return [];
}

interface PropertyPageParams {
  params: {
    id: string;
  };
}

export default function Page({ params }: PropertyPageParams) {
  const { id } = params;

  return (
    <Suspense fallback={
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        </div>
      </div>
    }>
      <ServerPropertyProvider>
        {({ getPropertyById }) => {
          // Get static property data for server-rendering
          const staticProperty = getPropertyById(id);
          
          // If no property found in static data, return 404
          if (!staticProperty) {
            return notFound();
          }
          
          // Pass static property as fallback and let client component fetch from Firebase
          return <PropertyPage propertyId={id} fallbackProperty={staticProperty} />;
        }}
      </ServerPropertyProvider>
    </Suspense>
  );
}

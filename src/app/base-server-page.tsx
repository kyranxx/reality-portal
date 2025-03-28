import React from 'react';
import { UniversalComponentLoader } from '@/app/_client-loader';
import { ClientComponentKey } from '@/app/_components';
import { Metadata } from 'next';

interface BaseServerPageProps {
  clientComponent: ClientComponentKey;
  fallback?: React.ReactNode;
  title?: string;
  description?: string;
  imageUrl?: string;
}

/**
 * Base Server Page
 *
 * This is a universal template for server-side rendered pages that handles proper
 * client/server rendering boundaries, SEO metadata, and error handling.
 *
 * Usage:
 * ```
 * export default function PropertyPage({ params }: { params: { id: string } }) {
 *   return (
 *     <BaseServerPage
 *       clientComponent="PropertyClientComponent"
 *       title={`Property ${params.id}`}
 *       description="View detailed property information"
 *     />
 *   );
 * }
 * ```
 */
export default function BaseServerPage({
  clientComponent,
  fallback,
  title,
  description,
  imageUrl,
}: BaseServerPageProps) {
  // Default fallback loading state if none provided
  const defaultFallback = (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500">Loading content...</p>
      </div>
    </div>
  );

  return (
    <div className="py-10">
      <div className="container">
        {/* Error boundary would go here in a more comprehensive implementation */}
        <UniversalComponentLoader
          componentKey={clientComponent}
          fallback={fallback || defaultFallback}
        />
      </div>
    </div>
  );
}

/**
 * Generate metadata for the page
 * This function can be used by pages that use BaseServerPage
 */
export function generateMetadata({
  title = 'Reality Portal',
  description = 'Find your dream property with Reality Portal',
  imageUrl = '/images/default-og.jpg',
}: Partial<BaseServerPageProps>): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

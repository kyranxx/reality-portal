import { Metadata, Viewport } from 'next';
import BaseServerPage, { generateMetadata as genMeta } from '@/app/base-server-page';
import { redirect } from 'next/navigation';

type Props = {
  params: { id: string }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return genMeta({
    title: `Property ${params.id} | Reality Portal`,
    description: "View detailed information about this property",
  });
}

// Separate viewport export as required by Next.js 14
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

/**
 * Server Component for Property Detail Page
 * 
 * This component correctly implements server-side rendering while
 * delegating client-side interactive elements to client components.
 */
export default function PropertyPage({ params }: Props) {
  // Validate id parameter
  if (!params.id || typeof params.id !== 'string' || params.id.length < 3) {
    // If invalid ID, redirect to properties list
    redirect('/nehnutelnosti');
  }
  
  // Use the base server page to handle proper rendering with PropertyDetailClient
  return (
    <BaseServerPage 
      clientComponent="PropertyDetailClient"
      title={`Property ${params.id} | Reality Portal`}
      description="View detailed information about this property"
    />
  );
}

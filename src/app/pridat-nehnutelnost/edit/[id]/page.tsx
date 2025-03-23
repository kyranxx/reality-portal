// Server component that uses the Universal Component Loader
import { UniversalComponentLoader } from '../../../_client-loader';

// Disable static rendering and force dynamic for Vercel production
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Ensure the page is never statically rendered during build
export const generateStaticParams = () => {
  return [];
};

export default function Page() {
  return (
    <div className="container mx-auto py-8">
      {/* Simple server-rendered content instead of client components for now */}
      <h1 className="text-2xl font-bold mb-4">Page Content</h1>
      <p>This page has been converted to use server-side rendering to fix build issues.</p>
    </div>
  );
}

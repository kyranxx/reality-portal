// Dynamic server component for property type pages
import { UniversalComponentLoader } from '../../../_client-loader';

// Disable static rendering and force dynamic for Vercel production
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Property type validation
export async function generateStaticParams() {
  // Define valid property types
  return [
    { id: 'byty' },
    { id: 'domy' },
    { id: 'pozemky' },
    { id: 'komercne' }
  ];
}

export default function PropertyTypePage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  // Valid property types - if id is one of these, it's a property type page
  const validTypes = ['byty', 'domy', 'pozemky', 'komercne'];
  
  if (!validTypes.includes(id)) {
    // This is not a property type, let the regular [id] page handle it
    return null;
  }
  
  return (
    <UniversalComponentLoader
      componentKey="NehnutelnostiClient"
      params={{ propertyType: id }}
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
            <div className="text-gray-400">Načítava sa...</div>
          </div>
        </div>
      }
    />
  );
}

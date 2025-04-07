// Dynamic server component for property type pages
import { UniversalComponentLoader } from '../../_client-loader';

// Disable static rendering and force dynamic for Vercel production
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Property type validation
export async function generateStaticParams() {
  // Define valid property types
  return [
    { type: 'byty' },
    { type: 'domy' },
    { type: 'pozemky' },
    { type: 'komercne' }
  ];
}

export default function PropertyTypePage({ params }: { params: { type: string } }) {
  const { type } = params;
  
  return (
    <UniversalComponentLoader
      componentKey="NehnutelnostiClient"
      params={{ propertyType: type }}
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

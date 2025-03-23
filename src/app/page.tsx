// Server component that uses the Universal Component Loader
import { UniversalComponentLoader } from './_client-loader';

// Optional dynamic rendering for pages that need it
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <UniversalComponentLoader 
      componentKey="HomeClient"
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

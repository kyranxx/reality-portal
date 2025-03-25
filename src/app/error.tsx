'use client';

import { useEffect } from 'react';
import Link from 'next/link';
// Import browser polyfills to handle global objects like 'self' in server context
import ensurePolyfills from '@/utils/browser-polyfills';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Oops! Niečo sa pokazilo</h1>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {error.message.includes('useAuth') 
          ? 'Nastala chyba pri overovaní používateľa. Prosím, prihláste sa znova.'
          : 'Nastala neočakávaná chyba. Skúste to znova neskôr.'}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={reset}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Skúsiť znova
        </button>
        
        <Link href="/" className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Späť na domovskú stránku
        </Link>
      </div>
    </div>
  );
}

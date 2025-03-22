'use client';

import React from 'react';
import Link from 'next/link';

// Global error component for App Router
// This handles errors that occur during rendering of the root layout
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Oops! Niečo sa pokazilo</h1>
          
          <p className="text-gray-600 mb-6 max-w-md">
            {error.message && error.message.includes('useAuth') 
              ? 'Nastala chyba pri overovaní používateľa. Prosím, prihláste sa znova.'
              : 'Nastala globálna chyba aplikácie. Skúste to znova neskôr.'}
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
      </body>
    </html>
  );
}

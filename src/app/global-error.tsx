'use client'; // Required for Next.js Error Components

import React, { useEffect } from 'react';
import Link from 'next/link';
import { trackError } from '@/utils/monitoring';
// Import browser polyfills to handle global objects like 'self' in server context
import ensurePolyfills from '@/utils/browser-polyfills';

// Global error component for App Router
// This handles errors that occur during rendering of the root layout
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the error to our monitoring system
  useEffect(() => {
    // Track the global error with enhanced context
    trackError(error, 'global-error-boundary');
    
    // Log additional diagnostic info
    console.error('Global error detected:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      digest: error.digest,
      url: typeof window !== 'undefined' ? window.location.href : '',
    });
  }, [error]);

  // Determine if this is an auth-related error
  const isAuthError = 
    error.message?.includes('auth') || 
    error.message?.includes('firebase') || 
    error.message?.includes('useAuth') ||
    error.message?.includes('permission');

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Oops! Niečo sa pokazilo</h1>
          
          <p className="text-gray-600 mb-6 max-w-md">
            {isAuthError
              ? 'Nastala chyba pri overovaní používateľa. Prosím, prihláste sa znova.'
              : 'Nastala globálna chyba aplikácie. Skúste to znova neskôr.'}
          </p>
          
          {process.env.NODE_ENV !== 'production' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md max-w-md text-left overflow-auto">
              <p className="font-mono text-sm text-red-700 mb-2">{error.name}: {error.message}</p>
              {error.digest && (
                <p className="font-mono text-xs text-red-500">Digest: {error.digest}</p>
              )}
              {error.stack && (
                <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-40">
                  {error.stack}
                </pre>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                // Clear any cached auth state that might be corrupted
                if (isAuthError && typeof localStorage !== 'undefined') {
                  // Clear any auth-related local storage
                  try {
                    // Clear firebase auth persistence
                    localStorage.removeItem('firebase:authUser');
                    sessionStorage.removeItem('firebase:authUser');
                  } catch (e) {
                    // Ignore storage errors
                  }
                }
                // Reset the error boundary
                reset();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Skúsiť znova
            </button>
            
            <Link href="/" className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Späť na domovskú stránku
            </Link>
            
            {isAuthError && (
              <Link href="/auth/login" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Prihlásiť sa
              </Link>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

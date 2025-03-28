'use client'; // Required for components that use client-side features like useEffect

import { useEffect } from 'react';
import AuthErrorBoundary from '@/components/AuthErrorBoundary';
import { initializeMonitoring } from '@/utils/monitoring';
import { auth } from '@/utils/firebase';
// Import browser polyfills to ensure proper environment handling
import ensurePolyfills from '@/utils/browser-polyfills';

interface ClientWrapperProps {
  children: React.ReactNode;
}

/**
 * Client-side wrapper to provide error boundaries and monitoring
 * for the App Router
 */
export default function ClientWrapper({ children }: ClientWrapperProps) {
  // Initialize monitoring on client side only
  useEffect(() => {
    // Set up error tracking and monitoring
    initializeMonitoring(auth);

    // Log important environment information
    if (process.env.NODE_ENV !== 'production') {
      console.log('Environment (App Router):', process.env.NODE_ENV);
      console.log('App Router initialized with error handling');
    }
  }, []);

  return (
    <AuthErrorBoundary
      fallback={
        <div className="auth-error-fallback p-4">
          <h2 className="text-xl font-bold text-red-700">Authentication Issue</h2>
          <p className="mt-2">
            We're experiencing an issue with the authentication system. Please try again in a
            moment.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      }
    >
      {children}
    </AuthErrorBoundary>
  );
}

import '../src/app/globals.css';
import { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { FirebaseAuthProvider } from '../src/utils/FirebaseAuthContext';
import { AppProvider } from '../src/contexts/AppContext';
import AuthErrorBoundary from '../src/components/AuthErrorBoundary';
import { initializeMonitoring } from '../src/utils/monitoring';
import { auth } from '../src/utils/firebase';

/**
 * Custom App component for the Pages Router
 * This ensures that auth context is properly provided to all pages
 * and handles errors gracefully
 */
function MyApp({ Component, pageProps }) {
  // Initialize monitoring on client side only
  useEffect(() => {
    // Set up error tracking and monitoring
    initializeMonitoring(auth);

    // Log important environment information
    if (process.env.NODE_ENV !== 'production') {
      console.log('Environment:', process.env.NODE_ENV);
      console.log('Next.js version:', process.env.__NEXT_VERSION);
      console.log('Vercel environment:', process.env.VERCEL_ENV || 'Not Vercel');
    }
  }, []);

  return (
    <>
      <Head>
        {/* Preconnect to important domains to improve performance */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
      </Head>
      <AppProvider>
        <AuthErrorBoundary
          fallback={
            <div className="auth-error-fallback">
              <h2>Authentication Issue</h2>
              <p>
                We're experiencing an issue with the authentication system. Please try again in a
                moment.
              </p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          }
        >
          <FirebaseAuthProvider>
            <Component {...pageProps} />
          </FirebaseAuthProvider>
        </AuthErrorBoundary>
      </AppProvider>
    </>
  );
}

export default MyApp;

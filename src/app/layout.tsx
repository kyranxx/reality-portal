import './globals.css';
import './font-loader.css'; // Import our custom font loader
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

// Server-side imports
import Header from '@/components/layouts/Header';
import Footer from '@/components/Footer';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/utils/FirebaseAuthContext';
import { FirebaseProvider } from '@/components/FirebaseProvider';
import { SWRProvider } from '@/components/SWRProvider';
import ClientWrapper from './ClientWrapper';
import { getEnvironmentInfo, getPublicAssetUrl } from '@/utils/environment';

// Get environment info for debugging
const envInfo = getEnvironmentInfo();

// Metadata must be in a server component (no 'use client' directive on this file)
export const metadata: Metadata = {
  title: 'Reality Portal - Realitný portál',
  description: 'Realitný portál pre predaj a prenájom nehnuteľností na Slovensku',
  keywords: 'reality, nehnuteľnosti, byty, domy, pozemky, predaj, prenájom, Slovensko',
  // Add other metadata
  applicationName: 'Reality Portal',
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
};

// Static generation configuration with incremental regeneration for performance
export const revalidate = 3600; // Revalidate content every hour by default

// Separate viewport export as required by Next.js 14
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
};

// For pages that need dynamic rendering, they'll specify 'force-dynamic' individually

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to important domains to improve performance */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />

        {/* Preload critical fonts to prevent FOUT/FOIT */}
        <link
          rel="preload"
          href={getPublicAssetUrl('/fonts/inter-regular.woff2')}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={getPublicAssetUrl('/fonts/inter-medium.woff2')}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Environment debugging script - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <Script id="env-debug" strategy="afterInteractive">
            {`console.log("Environment Info:", ${JSON.stringify(envInfo)})`}
          </Script>
        )}
      </head>
      <body className="flex flex-col min-h-screen font-sans">
        <FirebaseProvider fallback={<div className="p-4">Initializing Firebase...</div>}>
          <SWRProvider>
            <AuthProvider>
              <AppProvider>
                <ClientWrapper>
                  <Header />
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </ClientWrapper>
              </AppProvider>
            </AuthProvider>
          </SWRProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}

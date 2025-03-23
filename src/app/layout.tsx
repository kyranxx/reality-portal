import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// Server-side imports
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AppProvider } from '@/contexts/AppContext';
import { FirebaseAuthProvider } from '@/utils/FirebaseAuthContext';

const inter = Inter({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

// Metadata must be in a server component (no 'use client' directive on this file)
export const metadata: Metadata = {
  title: 'Reality Portal - Realitný portál',
  description: 'Realitný portál pre predaj a prenájom nehnuteľností na Slovensku',
  keywords: 'reality, nehnuteľnosti, byty, domy, pozemky, predaj, prenájom, Slovensko',
};

// Static generation configuration with incremental regeneration for performance
export const revalidate = 3600; // Revalidate content every hour by default

// For pages that need dynamic rendering, they'll specify 'force-dynamic' individually

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex flex-col min-h-screen">
        <FirebaseAuthProvider>
          <AppProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </AppProvider>
        </FirebaseAuthProvider>
      </body>
    </html>
  );
}

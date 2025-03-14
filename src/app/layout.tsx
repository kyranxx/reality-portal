import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FirebaseAuthProvider } from '@/utils/FirebaseAuthContext';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Reality Portal - Realitný portál',
  description: 'Realitný portál pre predaj a prenájom nehnuteľností na Slovensku',
  keywords: 'reality, nehnuteľnosti, byty, domy, pozemky, predaj, prenájom, Slovensko',
};

// Disable static optimization for the entire app to ensure proper authentication handling
export const dynamic = 'force-dynamic';

// Disable static generation for the entire app
export const revalidate = 0;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk" className={inter.variable}>
      <body className="flex flex-col min-h-screen">
        <FirebaseAuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </FirebaseAuthProvider>
      </body>
    </html>
  );
}

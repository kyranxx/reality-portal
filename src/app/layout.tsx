import './globals.css';
import { Inter } from 'next/font/google';
import { metadata } from './metadata';

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

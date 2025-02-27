import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import { AuthProvider } from '@/utils/AuthContext';

export const metadata: Metadata = {
  title: 'Reality Portal - Realitný portál',
  description: 'Realitný portál pre predaj a prenájom nehnuteľností na Slovensku',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

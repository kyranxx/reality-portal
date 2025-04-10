import type { Metadata, Viewport } from 'next';

// Move viewport settings from metadata to a dedicated viewport export
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
};

// Metadata without viewport settings
export const metadata: Metadata = {
  title: '404 - Stránka nenájdená | Reality Portal',
  description: 'Požadovaná stránka neexistuje.',
};

export default function NotFound() {
  return (
    <div className="container py-8 text-center">
      <h1 className="text-3xl font-bold mb-6">404 - Stránka nenájdená</h1>
      <p className="mb-4">Ľutujeme, požadovaná stránka neexistuje.</p>
      <a href="/" className="text-blue-500 hover:underline">
        Späť na domovskú stránku
      </a>
    </div>
  );
}

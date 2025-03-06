'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container py-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Niečo sa pokazilo!</h1>
      <p className="mb-4">Ľutujeme, vyskytla sa chyba.</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Skúsiť znova
      </button>
    </div>
  );
}

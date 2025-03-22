'use client';

// Use SSR instead of Edge runtime to ensure proper Firebase initialization
export const runtime = 'nodejs';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified auth page with register mode
    router.replace('/auth/unified');
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
        <div className="text-gray-400">Presmerovanie...</div>
      </div>
    </div>
  );
}

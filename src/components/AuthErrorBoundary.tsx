'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthErrorBoundary({
  children,
  fallback = <div>Loading authentication...</div>,
}: AuthErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (hasError && isClient) {
      // Redirect to login page if there's an authentication error
      router.push('/auth/login');
    }
  }, [hasError, router, isClient]);

  if (!isClient) {
    // During SSR, show the fallback
    return <>{fallback}</>;
  }

  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Authentication error:', error);
    setHasError(true);
    return <>{fallback}</>;
  }
}

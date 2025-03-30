'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/FirebaseAuthContext';

interface ProtectedRouteWrapperProps {
  children: ReactNode;
  redirectTo?: string;
  allowIfAuthenticated?: boolean;
}

/**
 * ProtectedRouteWrapper component that restricts access to certain pages
 * based on authentication status
 * 
 * @param children The content to render if access is allowed
 * @param redirectTo The path to redirect to if access is not allowed
 * @param allowIfAuthenticated When true, allows access only if user is authenticated
 *                            When false, allows access only if user is NOT authenticated
 */
export function ProtectedRouteWrapper({
  children,
  redirectTo = '/auth/login',
  allowIfAuthenticated = true,
}: ProtectedRouteWrapperProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Skip redirect during initial loading
    if (isLoading) return;

    // Store the current URL to redirect back after login
    if (!user && allowIfAuthenticated) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      }
      router.push(redirectTo);
    }

    // Redirect authenticated users away from auth pages if needed
    if (user && !allowIfAuthenticated) {
      const redirectPath = 
        typeof window !== 'undefined'
          ? sessionStorage.getItem('redirectAfterLogin') || '/dashboard'
          : '/dashboard';
      
      router.push(redirectPath);
    }
  }, [user, isLoading, router, redirectTo, allowIfAuthenticated]);

  // Show nothing while loading or redirecting
  if (isLoading || (user && !allowIfAuthenticated) || (!user && allowIfAuthenticated)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-200 rounded-full mb-4"></div>
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  // Render children if the user has access
  return <>{children}</>;
}

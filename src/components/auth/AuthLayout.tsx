'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  adminMode?: boolean; // Added for admin-specific styling
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showLogo = true,
  adminMode = false
}: AuthLayoutProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${adminMode ? 'bg-gray-100' : 'bg-gray-50'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className={`max-w-md w-full space-y-8 ${adminMode ? 'bg-gray-50 border border-gray-200' : 'bg-white'} p-8 rounded-lg shadow-md`}>
        {showLogo && (
          <div className="flex justify-center">
            <Link href="/" className="flex items-center">
              <span className={`text-2xl font-bold ${adminMode ? 'text-gray-800' : 'text-blue-600'}`}>
                {adminMode ? 'Admin Portal' : 'Reality Portal'}
              </span>
            </Link>
          </div>
        )}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

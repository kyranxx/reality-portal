'use client';

import React from 'react';
import { AuthButtonProps } from '../AuthButton';

interface ClientAuthButtonProps extends AuthButtonProps {
  onClick?: () => void;
}

/**
 * Client-side button component for authentication flows.
 * This component includes event handler logic and is marked with 'use client'
 * to ensure it only runs on the client side.
 */
export function AuthButtonClient({
  children,
  type = 'button',
  isLoading = false,
  onClick,
  disabled = false,
  fullWidth = false,
  variant = 'primary',
}: ClientAuthButtonProps) {
  // Use the provided onClick or a no-op function if not provided
  const handleClick = onClick || (() => {});
  
  const getButtonClasses = () => {
    const baseClasses = 'flex justify-center items-center py-2 px-4 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800';
    const widthClasses = fullWidth ? 'w-full' : '';
    
    let variantClasses = '';
    switch (variant) {
      case 'primary':
        variantClasses = 'text-white bg-gray-800 hover:bg-gray-900 border-transparent';
        break;
      case 'secondary':
        variantClasses = 'text-white bg-gray-600 hover:bg-gray-700 border-transparent';
        break;
      case 'outline':
        variantClasses = 'text-gray-800 bg-white hover:bg-gray-50 border-gray-300';
        break;
      default:
        variantClasses = 'text-white bg-gray-800 hover:bg-gray-900 border-transparent';
    }
    
    const disabledClasses = (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : '';
    
    return `${baseClasses} ${widthClasses} ${variantClasses} ${disabledClasses}`;
  };

  return (
    <button
      type={type}
      className={getButtonClasses()}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}

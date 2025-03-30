'use client';

import React from 'react';
import { FormInputProps } from '../FormInput';

interface ClientFormInputProps extends FormInputProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Client-side form input component.
 * This component includes the event handler logic and is marked with 'use client'
 * to ensure it only runs on the client side.
 */
export function FormInputClient({
  id,
  type,
  name,
  label,
  value,
  onChange,
  required = false,
  placeholder = '',
  error,
  autoComplete,
}: ClientFormInputProps) {
  // Use the provided onChange or a no-op function if not provided
  const handleChange = onChange || (() => {});
  
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={name || id}
        type={type}
        required={required}
        className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
          error ? 'border-red-300' : 'border-gray-300'
        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        autoComplete={autoComplete}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

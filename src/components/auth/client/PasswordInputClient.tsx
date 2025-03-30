'use client';

import React, { useState } from 'react';
import { PasswordInputProps } from '../PasswordInput';

interface ClientPasswordInputProps extends PasswordInputProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Client-side password input component.
 * This component includes show/hide functionality, strength meter, and event handler logic.
 * It's marked with 'use client' to ensure it only runs on the client side.
 */
export function PasswordInputClient({
  id,
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder = '',
  error,
  autoComplete,
  showStrengthMeter = false,
  className,
}: ClientPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  // Use the provided onChange or a no-op function if not provided
  const handleChange = onChange || (() => {});

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Password strength calculation
  const getPasswordStrength = (password: string): { strength: number; text: string; color: string } => {
    if (!password) return { strength: 0, text: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    let text = '';
    let color = '';
    
    switch (strength) {
      case 0:
      case 1:
        text = 'Weak';
        color = 'bg-red-500';
        break;
      case 2:
      case 3:
        text = 'Medium';
        color = 'bg-yellow-500';
        break;
      case 4:
      case 5:
        text = 'Strong';
        color = 'bg-green-500';
        break;
      default:
        text = '';
        color = '';
    }

    return { strength, text, color };
  };

  const strengthInfo = showStrengthMeter ? getPasswordStrength(value) : { strength: 0, text: '', color: '' };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name || id}
          type={showPassword ? 'text' : 'password'}
          required={required}
          className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
            error ? 'border-red-300' : 'border-gray-300'
          } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${className || ''}`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5 text-gray-500 focus:outline-none"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {showStrengthMeter && value && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${strengthInfo.color}`}
              style={{ width: `${(strengthInfo.strength / 5) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs mt-1 text-gray-600">
            Password strength: <span className="font-medium">{strengthInfo.text}</span>
          </p>
        </div>
      )}
    </div>
  );
}

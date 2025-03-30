/**
 * Shared type definitions for client components
 * 
 * This file provides types and utilities to handle client-side only props
 * that help prevent serialization warnings in Next.js server components.
 */

import React from 'react';

/**
 * Marks a prop type as client-only, indicating it cannot be serialized
 * from server to client components. Use this for function props and other
 * non-serializable values.
 * 
 * @example
 * interface MyProps {
 *   onClick: ClientProp<() => void>;
 * }
 */
export type ClientProp<T> = T;

/**
 * Base interface for input props to help with type consistency
 */
export interface BaseInputProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
}

/**
 * Form input props with properly marked client-side event handlers
 */
export interface FormInputProps extends BaseInputProps {
  type: string;
  value: string;
  onChange: ClientProp<(e: React.ChangeEvent<HTMLInputElement>) => void>;
  placeholder?: string;
  autoComplete?: string;
}

/**
 * Password input props with properly marked client-side event handlers
 */
export interface PasswordInputProps extends BaseInputProps {
  value: string;
  onChange: ClientProp<(e: React.ChangeEvent<HTMLInputElement>) => void>;
  placeholder?: string;
  autoComplete?: string;
  showStrengthMeter?: boolean;
}

/**
 * Button props with properly marked client-side event handlers
 */
export interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: ClientProp<() => void>;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

/**
 * Social auth button props
 */
export interface SocialAuthButtonProps {
  provider: 'google' | 'facebook' | 'twitter';
  onClick: ClientProp<() => void>;
  isLoading?: boolean;
  disabled?: boolean;
}

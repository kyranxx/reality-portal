/**
 * Server-side component for password inputs
 * 
 * This component forwards all props including event handlers to 
 * a client-side implementation.
 */

import React from 'react';
import { PasswordInputClient } from './client/PasswordInputClient';

export interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  showStrengthMeter?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string; // For custom styling
}

export function PasswordInput(props: PasswordInputProps) {
  return <PasswordInputClient {...props} />;
}

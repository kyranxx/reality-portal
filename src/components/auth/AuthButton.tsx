/**
 * Server-side component for auth buttons
 * 
 * This component forwards all props including event handlers to 
 * a client-side implementation.
 */

import React, { ReactNode } from 'react';
import { AuthButtonClient } from './client/AuthButtonClient';

export interface AuthButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
}

export function AuthButton(props: AuthButtonProps) {
  return <AuthButtonClient {...props} />;
}

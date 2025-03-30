/**
 * Server-side component for form inputs
 * 
 * This component forwards all props including event handlers to 
 * a client-side implementation.
 */

import React from 'react';
import { FormInputClient } from './client/FormInputClient';

export interface FormInputProps {
  id: string;
  type: string;
  label: string;
  value: string;
  name?: string; 
  required?: boolean;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormInput(props: FormInputProps) {
  return <FormInputClient {...props} />;
}

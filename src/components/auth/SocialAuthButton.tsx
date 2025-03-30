/**
 * Server-side component for social authentication buttons
 * 
 * This component forwards all props including event handlers to 
 * a client-side implementation.
 */

import React from 'react';
import { SocialAuthButtonClient } from './client/SocialAuthButtonClient';

export interface SocialAuthButtonProps {
  provider: 'google' | 'facebook' | 'twitter';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function SocialAuthButton(props: SocialAuthButtonProps) {
  return <SocialAuthButtonClient {...props} />;
}

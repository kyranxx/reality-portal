'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/utils/FirebaseAuthContext';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FormInput } from '@/components/auth/FormInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { SocialAuthButton } from '@/components/auth/SocialAuthButton';

export default function LoginClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const { signIn, signInWithGoogle, user, isLoading, error } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectPath = 
        typeof window !== 'undefined'
          ? sessionStorage.getItem('redirectAfterLogin') || '/dashboard'
          : '/dashboard';
      
      router.push(redirectPath);
    }
  }, [user, router]);

  // Form validation
  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await signIn(email, password);
        // Note: The redirect is handled by the useEffect above when user state changes
      } catch (err) {
        console.error('Login error:', err);
      }
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Note: The redirect is handled by the useEffect above when user state changes
    } catch (err) {
      console.error('Google sign-in error:', err);
    }
  };

  return (
    <AuthLayout 
      title="Log in to your account" 
      subtitle="Welcome back! Please enter your details."
    >
      <div className="mt-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <FormInput
            id="email"
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            error={formErrors.email}
            autoComplete="email"
          />

          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={formErrors.password}
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/auth/reset-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <AuthButton type="submit" isLoading={isLoading} fullWidth>
              Sign in
            </AuthButton>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <SocialAuthButton
              provider="google"
              onClick={handleGoogleSignIn}
              isLoading={isLoading}
            />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

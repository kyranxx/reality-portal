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

export default function RegisterClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  
  const { signUp, user, loading, error } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Form validation
  const validateForm = () => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};
    let isValid = true;

    // Name validation
    if (!name) {
      errors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Terms validation
    if (!agreeToTerms) {
      errors.terms = 'You must agree to the terms and conditions';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await signUp(email, password, name);
        // The redirect is handled by the useEffect when user state changes
      } catch (err) {
        console.error('Registration error:', err);
      }
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    console.error('Google sign-in is not available in this build');
    // This functionality would need to be re-implemented
  };

  return (
    <AuthLayout 
      title="Vytvorte si účet" 
      subtitle="Zaregistrujte sa a začnite používať našu platformu."
    >
      <div className="mt-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleRegister}>
          <FormInput
            id="name"
            type="text"
            label="Celé meno"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ján Novák"
            error={formErrors.name}
            autoComplete="name"
          />

          <FormInput
            id="email"
            type="email"
            label="E-mailová adresa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="vas@email.sk"
            error={formErrors.email}
            autoComplete="email"
          />

          <PasswordInput
            id="password"
            label="Heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={formErrors.password}
            autoComplete="new-password"
            showStrengthMeter
          />

          <PasswordInput
            id="confirm-password"
            label="Potvrdiť heslo"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            error={formErrors.confirmPassword}
            autoComplete="new-password"
          />

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                Súhlasím s{' '}
                <Link href="/podmienky-pouzitia" className="text-gray-600 hover:text-gray-500">
                  Podmienkami používania
                </Link>{' '}
                a{' '}
                <Link href="/ochrana-osobnych-udajov" className="text-gray-600 hover:text-gray-500">
                  Ochranou osobných údajov
                </Link>
              </label>
              {formErrors.terms && (
                <p className="mt-1 text-sm text-red-600">{formErrors.terms}</p>
              )}
            </div>
          </div>

          <div>
            <AuthButton type="submit" isLoading={loading} fullWidth>
              Vytvoriť účet
            </AuthButton>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Alebo pokračujte s</span>
            </div>
          </div>

          <div className="mt-6">
            <SocialAuthButton
              provider="google"
              onClick={handleGoogleSignIn}
              isLoading={loading}
            />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Už máte účet?{' '}
          <Link href="/auth/login" className="font-medium text-gray-600 hover:text-gray-500">
            Prihláste sa
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

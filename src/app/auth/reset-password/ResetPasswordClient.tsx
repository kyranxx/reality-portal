'use client';

import React, { useState } from 'react';
import { useAuth } from '@/utils/FirebaseAuthContext';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FormInput } from '@/components/auth/FormInput';
import { AuthButton } from '@/components/auth/AuthButton';
import Link from 'next/link';

export default function ResetPasswordClient() {
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword, loading, error } = useAuth();

  // Form validation
  const validateForm = () => {
    const errors: { email?: string } = {};
    let isValid = true;

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await resetPassword(email);
        setSubmitted(true);
      } catch (err) {
        console.error('Password reset error:', err);
        setSubmitted(false);
      }
    }
  };

  return (
    <AuthLayout
      title="Obnovenie hesla"
      subtitle="Zadajte vašu e-mailovú adresu na obnovenie hesla"
    >
      <div className="mt-8">
        {error && !submitted && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 text-green-700 rounded-md">
              <p className="font-medium">E-mail na obnovenie hesla odoslaný!</p>
              <p className="mt-2 text-sm">
                Ak účet s e-mailom {email} existuje, dostanete e-mail
                s pokynmi na obnovenie hesla.
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <Link href="/auth/login">
                <AuthButton variant="primary" fullWidth>
                  Návrat na prihlásenie
                </AuthButton>
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm text-gray-600 hover:text-gray-500"
              >
                Použiť iný e-mail
              </button>
            </div>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleResetPassword}>
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

            <div>
              <AuthButton type="submit" isLoading={loading} fullWidth>
                Odoslať odkaz na obnovenie
              </AuthButton>
            </div>

            <div className="text-center mt-4">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-500"
              >
                Späť na prihlásenie
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}

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
      title="Reset Password"
      subtitle="Enter your email address to reset your password"
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
              <p className="font-medium">Password reset email sent!</p>
              <p className="mt-2 text-sm">
                If an account exists with the email {email}, you will receive an email with
                instructions on how to reset your password.
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <Link href="/auth/login">
                <AuthButton variant="primary" fullWidth>
                  Return to login
                </AuthButton>
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Use a different email
              </button>
            </div>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleResetPassword}>
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

            <div>
              <AuthButton type="submit" isLoading={loading} fullWidth>
                Send reset link
              </AuthButton>
            </div>

            <div className="text-center mt-4">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}

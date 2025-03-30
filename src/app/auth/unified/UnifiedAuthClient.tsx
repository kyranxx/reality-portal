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

type AuthTab = 'login' | 'register' | 'reset';

export default function UnifiedAuthClient() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  
  // Register state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [registerErrors, setRegisterErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  
  // Reset password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetErrors, setResetErrors] = useState<{ email?: string }>({});
  const [resetSubmitted, setResetSubmitted] = useState(false);
  
  const { signIn, signUp, signInWithGoogle, resetPassword, user, isLoading, error } = useAuth();
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

  // Form validations
  const validateLoginForm = () => {
    const errors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!loginEmail) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!loginPassword) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setLoginErrors(errors);
    return isValid;
  };

  const validateRegisterForm = () => {
    const errors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};
    let isValid = true;

    if (!registerEmail) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(registerEmail)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!registerPassword) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (registerPassword.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (registerPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!agreeToTerms) {
      errors.terms = 'You must agree to the terms and conditions';
      isValid = false;
    }

    setRegisterErrors(errors);
    return isValid;
  };

  const validateResetForm = () => {
    const errors: { email?: string } = {};
    let isValid = true;

    if (!resetEmail) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    setResetErrors(errors);
    return isValid;
  };

  // Event handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLoginForm()) {
      try {
        await signIn(loginEmail, loginPassword);
      } catch (err) {
        console.error('Login error:', err);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateRegisterForm()) {
      try {
        await signUp(registerEmail, registerPassword);
      } catch (err) {
        console.error('Registration error:', err);
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateResetForm()) {
      try {
        await resetPassword(resetEmail);
        setResetSubmitted(true);
      } catch (err) {
        console.error('Password reset error:', err);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign-in error:', err);
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'login':
        return 'Log in to your account';
      case 'register':
        return 'Create an account';
      case 'reset':
        return 'Reset Password';
      default:
        return '';
    }
  };

  const getTabSubtitle = () => {
    switch (activeTab) {
      case 'login':
        return 'Welcome back! Please enter your details.';
      case 'register':
        return 'Sign up to get started with our platform.';
      case 'reset':
        return 'Enter your email address to reset your password';
      default:
        return '';
    }
  };

  // Render the appropriate form based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'login':
        return (
          <form className="space-y-6" onSubmit={handleLogin}>
            <FormInput
              id="login-email"
              type="email"
              label="Email address"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              placeholder="your@email.com"
              error={loginErrors.email}
              autoComplete="email"
            />

            <PasswordInput
              id="login-password"
              label="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              error={loginErrors.password}
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

              <button
                type="button"
                onClick={() => setActiveTab('reset')}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </button>
            </div>

            <div>
              <AuthButton type="submit" isLoading={isLoading} fullWidth>
                Sign in
              </AuthButton>
            </div>

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
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </button>
            </p>
          </form>
        );
      
      case 'register':
        return (
          <form className="space-y-6" onSubmit={handleRegister}>
            <FormInput
              id="register-email"
              type="email"
              label="Email address"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              placeholder="your@email.com"
              error={registerErrors.email}
              autoComplete="email"
            />

            <PasswordInput
              id="register-password"
              label="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              error={registerErrors.password}
              autoComplete="new-password"
              showStrengthMeter
            />

            <PasswordInput
              id="confirm-password"
              label="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={registerErrors.confirmPassword}
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
                  I agree to the{' '}
                  <Link href="/podmienky-pouzitia" className="text-blue-600 hover:text-blue-500">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/ochrana-osobnych-udajov" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </label>
                {registerErrors.terms && (
                  <p className="mt-1 text-sm text-red-600">{registerErrors.terms}</p>
                )}
              </div>
            </div>

            <div>
              <AuthButton type="submit" isLoading={isLoading} fullWidth>
                Create account
              </AuthButton>
            </div>

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
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </button>
            </p>
          </form>
        );
      
      case 'reset':
        return resetSubmitted ? (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 text-green-700 rounded-md">
              <p className="font-medium">Password reset email sent!</p>
              <p className="mt-2 text-sm">
                If an account exists with the email {resetEmail}, you will receive an email with
                instructions on how to reset your password.
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => setActiveTab('login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              >
                Return to login
              </button>
              <button
                onClick={() => setResetSubmitted(false)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Use a different email
              </button>
            </div>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <FormInput
              id="reset-email"
              type="email"
              label="Email address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              placeholder="your@email.com"
              error={resetErrors.email}
              autoComplete="email"
            />

            <div>
              <AuthButton type="submit" isLoading={isLoading} fullWidth>
                Send reset link
              </AuthButton>
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Back to login
              </button>
            </div>
          </form>
        );
      
      default:
        return null;
    }
  };

  return (
    <AuthLayout title={getTabTitle()} subtitle={getTabSubtitle()}>
      <div className="mt-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            type="button"
            className={`py-2 px-4 text-center w-1/3 font-medium text-sm ${
              activeTab === 'login'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`py-2 px-4 text-center w-1/3 font-medium text-sm ${
              activeTab === 'register'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
          <button
            type="button"
            className={`py-2 px-4 text-center w-1/3 font-medium text-sm ${
              activeTab === 'reset'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('reset')}
          >
            Reset
          </button>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </AuthLayout>
  );
}

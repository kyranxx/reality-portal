'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/utils/FirebaseAuthContext';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FormInput } from '@/components/auth/FormInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { AuthButton } from '@/components/auth/AuthButton';

// List of allowed admin emails
const ADMIN_EMAILS = ['admin@example.com', 'admin@realityportal.com'];

// Track login attempts for rate limiting
let loginAttempts = 0;
const MAX_LOGIN_ATTEMPTS = 5;
const ATTEMPT_RESET_TIME = 30 * 60 * 1000; // 30 minutes

export default function AdminLoginClientComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showMfaField, setShowMfaField] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string; mfa?: string }>({});
  const [lockedOut, setLockedOut] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { signIn, user, isLoading, error } = useAuth();
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      // Log successful admin login
      logAdminAction('admin_login_success', user.email);
      
      // Redirect to admin panel
      router.push('/admin');
    } else if (user && user.email && !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      // If logged in but not an admin, sign out and show error
      setGeneralError('This account does not have administrator privileges.');
      logAdminAction('admin_login_unauthorized_attempt', user.email);
    }
  }, [user, router]);

  // Handle lockout timer
  useEffect(() => {
    if (lockedOut && lockoutTime > 0) {
      timerRef.current = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1) {
            setLockedOut(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lockedOut, lockoutTime]);

  // Log admin actions to improve security auditing
  const logAdminAction = (action: string, userEmail: string) => {
    console.log(`[ADMIN AUDIT] ${action} - ${userEmail} - ${new Date().toISOString()} - ${getUserAgent()}`);
    // In a real implementation, this would send data to a secure logging service
  };

  // Get browser/device info for security logging
  const getUserAgent = () => {
    if (typeof navigator !== 'undefined') {
      return navigator.userAgent;
    }
    return 'unknown';
  };

  // Form validation with additional security checks
  const validateForm = () => {
    const errors: { email?: string; password?: string; mfa?: string } = {};
    let isValid = true;

    // Check if we're locked out due to too many attempts
    if (lockedOut) {
      setGeneralError(`Too many failed attempts. Try again in ${formatTime(lockoutTime)}.`);
      return false;
    }

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    } else if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
      // Pre-check if this is an admin email to prevent unnecessary auth attempts
      errors.email = 'This email is not registered as an administrator';
      logAdminAction('admin_login_invalid_email', email);
      isValid = false;
    }

    // Password validation - stronger requirements for admin
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    // MFA validation when enabled
    if (showMfaField && (!verificationCode || verificationCode.length !== 6)) {
      errors.mfa = 'Valid 6-digit verification code required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Format lockout time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Handle rate limiting when login fails
  const handleFailedAttempt = () => {
    loginAttempts++;
    
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      // Calculate exponential backoff (gets longer with more failures)
      const lockoutDuration = Math.min(5 * 60, 30 * Math.pow(2, loginAttempts - MAX_LOGIN_ATTEMPTS));
      setLockedOut(true);
      setLockoutTime(lockoutDuration);
      
      // Log the lockout
      logAdminAction('admin_login_lockout', email);
      
      // Reset after the timeout period
      setTimeout(() => {
        loginAttempts = 0;
      }, ATTEMPT_RESET_TIME);
    }
  };

  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (validateForm()) {
      try {
        // Log attempt but without sensitive data
        logAdminAction('admin_login_attempt', email);
        
        // Attempt to sign in with Firebase
        await signIn(email, password);
        
        // If MFA would be implemented:
        // if (!showMfaField) {
        //   setShowMfaField(true);
        //   return;
        // }
        
        // Success is handled by the useEffect redirect
      } catch (err: any) {
        console.error('Admin login error:', err);
        setGeneralError('Invalid administrator credentials');
        
        // Track failed attempt for rate limiting
        handleFailedAttempt();
        
        // Log failure
        logAdminAction('admin_login_failure', email);
      }
    }
  };

  return (
    <AuthLayout 
      title="Administrator Access" 
      subtitle="Secure login for system administrators"
      adminMode={true}
    >
      <div className="mt-8">
        {/* Security alert banner */}
        <div className="mb-6 p-3 bg-yellow-50 text-yellow-800 rounded border border-yellow-200">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Restricted Access Area</p>
              <p className="text-sm mt-1">
                This login is for authorized administrators only. All login attempts are logged and monitored.
              </p>
            </div>
          </div>
        </div>

        {(generalError || error) && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
            {generalError || error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <FormInput
            id="email"
            type="email"
            label="Administrator Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@example.com"
            error={formErrors.email}
            autoComplete="off" // Disable autofill for security
            className="bg-gray-50" // Distinct styling
          />

          <PasswordInput
            id="password"
            label="Administrator Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={formErrors.password}
            autoComplete="off" // Disable autofill for security
            className="bg-gray-50" // Distinct styling
          />

          {showMfaField && (
            <FormInput
              id="verification-code"
              type="text"
              label="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              placeholder="6-digit code"
              error={formErrors.mfa}
              className="bg-gray-50"
              maxLength={6}
            />
          )}

          <div>
            <AuthButton 
              type="submit" 
              isLoading={isLoading} 
              fullWidth
              variant="primary"
              disabled={lockedOut}
            >
              {showMfaField ? "Verify & Sign in" : "Sign in to Admin Panel"}
            </AuthButton>
          </div>

          {lockedOut && (
            <div className="text-center text-sm text-red-600">
              Account temporarily locked. Try again in {formatTime(lockoutTime)}.
            </div>
          )}
        </form>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm">
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              Return to regular login
            </Link>
          </div>
          <div className="text-sm">
            <Link href="/" className="font-medium text-gray-600 hover:text-gray-500">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

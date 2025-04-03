'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/utils/FirebaseAuthContext';
import { useApp } from '@/contexts/AppContext';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FormInput } from '@/components/auth/FormInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { SocialAuthButton } from '@/components/auth/SocialAuthButton';
import AuthErrorHandler from '@/components/auth/AuthErrorHandler';

type AuthTab = 'login' | 'register' | 'reset';

export default function UnifiedAuthClient() {
  const { t } = useApp();
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
  
  const { signIn, signUp, resetPassword, user, loading, error } = useAuth();
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
      errors.email = t('auth.errors.emailRequired', 'Email je povinný');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      errors.email = t('auth.errors.emailInvalid', 'Email je neplatný');
      isValid = false;
    }

    if (!loginPassword) {
      errors.password = t('auth.errors.passwordRequired', 'Heslo je povinné');
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
      errors.email = t('auth.errors.emailRequired', 'Email je povinný');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(registerEmail)) {
      errors.email = t('auth.errors.emailInvalid', 'Email je neplatný');
      isValid = false;
    }

    if (!registerPassword) {
      errors.password = t('auth.errors.passwordRequired', 'Heslo je povinné');
      isValid = false;
    } else if (registerPassword.length < 8) {
      errors.password = t('auth.errors.passwordTooShort', 'Heslo musí obsahovať minimálne 8 znakov');
      isValid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = t('auth.errors.confirmPasswordRequired', 'Potvrdenie hesla je povinné');
      isValid = false;
    } else if (registerPassword !== confirmPassword) {
      errors.confirmPassword = t('auth.errors.passwordsDoNotMatch', 'Heslá sa nezhodujú');
      isValid = false;
    }

    if (!agreeToTerms) {
      errors.terms = t('auth.errors.termsRequired', 'Musíte súhlasiť s podmienkami');
      isValid = false;
    }

    setRegisterErrors(errors);
    return isValid;
  };

  const validateResetForm = () => {
    const errors: { email?: string } = {};
    let isValid = true;

    if (!resetEmail) {
      errors.email = t('auth.errors.emailRequired', 'Email je povinný');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      errors.email = t('auth.errors.emailInvalid', 'Email je neplatný');
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
        // Use the email username part as the name
        await signUp(registerEmail, registerPassword, registerEmail.split('@')[0]);
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
    console.error('Google sign-in is not available in this build');
    // This functionality would need to be re-implemented
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'login':
        return t('auth.login', 'Prihlásenie');
      case 'register':
        return t('auth.register', 'Registrácia');
      case 'reset':
        return t('auth.resetPassword', 'Obnoviť heslo');
      default:
        return '';
    }
  };

  const getTabSubtitle = () => {
    switch (activeTab) {
      case 'login':
        return t('auth.signInPrompt', 'Vitajte späť! Prosím, zadajte svoje prihlasovacie údaje.');
      case 'register':
        return t('auth.signUpPrompt', 'Registrujte sa a získajte prístup k našej platforme.');
      case 'reset':
        return t('auth.resetPrompt', 'Zadajte svoj e-mail na obnovenie hesla');
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
              label={t('auth.email', 'Email')}
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              placeholder="your@email.com"
              error={loginErrors.email}
              autoComplete="email"
            />

            <PasswordInput
              id="login-password"
              label={t('auth.password', 'Heslo')}
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
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                  {t('auth.rememberMe', 'Zapamätať si ma')}
                </label>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('reset')}
                className="text-sm font-medium text-black hover:text-gray-700"
              >
                {t('auth.forgotPassword', 'Zabudli ste heslo?')}
              </button>
            </div>

            <div>
              <AuthButton type="submit" isLoading={loading} fullWidth>
                {t('auth.signIn', 'Prihlásiť sa')}
              </AuthButton>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('auth.orSignInWith', 'alebo sa prihláste cez')}</span>
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
              {t('auth.dontHaveAccount', 'Nemáte účet?')}{' '}
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="font-medium text-black hover:text-gray-700"
              >
                {t('auth.createAccount', 'Vytvoriť účet')}
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
              label={t('auth.email', 'Email')}
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              placeholder="your@email.com"
              error={registerErrors.email}
              autoComplete="email"
            />

            <PasswordInput
              id="register-password"
              label={t('auth.password', 'Heslo')}
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              error={registerErrors.password}
              autoComplete="new-password"
              showStrengthMeter
            />

            <PasswordInput
              id="confirm-password"
              label={t('auth.confirmPassword', 'Potvrdiť heslo')}
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
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  {t('auth.agreeToTerms', 'Súhlasím s')}{' '}
                  <Link href="/podmienky-pouzitia" className="text-black hover:text-gray-700">
                    {t('footer.terms', 'Podmienkami používania')}
                  </Link>{' '}
                  {t('auth.and', 'a')}{' '}
                  <Link href="/ochrana-osobnych-udajov" className="text-black hover:text-gray-700">
                    {t('footer.privacy', 'Ochranou osobných údajov')}
                  </Link>
                </label>
                {registerErrors.terms && (
                  <p className="mt-1 text-sm text-red-600">{registerErrors.terms}</p>
                )}
              </div>
            </div>

            <div>
              <AuthButton type="submit" isLoading={loading} fullWidth>
                {t('auth.signUp', 'Registrovať sa')}
              </AuthButton>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('auth.orSignUpWith', 'alebo sa registrujte cez')}</span>
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
              {t('auth.alreadyHaveAccount', 'Už máte účet?')}{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="font-medium text-black hover:text-gray-700"
              >
                {t('auth.signIn', 'Prihlásiť sa')}
              </button>
            </p>
          </form>
        );
      
      case 'reset':
        return resetSubmitted ? (
          <div className="space-y-6">
            <div className="success-message">
              <p className="font-medium">{t('auth.resetPasswordSuccess', 'Pokyny na obnovenie hesla boli odoslané na váš email')}</p>
              <p className="mt-2 text-sm">
                {t('auth.resetPasswordSentTo', 'Ak účet s týmto e-mailom existuje, dostanete e-mail s pokynmi na obnovenie hesla.')}
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => setActiveTab('login')}
                className="btn btn-primary w-full justify-center"
              >
                {t('auth.returnToLogin', 'Späť na prihlásenie')}
              </button>
              <button
                onClick={() => setResetSubmitted(false)}
                className="text-sm text-black hover:text-gray-700"
              >
                {t('auth.useDifferentEmail', 'Použiť iný email')}
              </button>
            </div>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <FormInput
              id="reset-email"
              type="email"
              label={t('auth.email', 'Email')}
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              placeholder="your@email.com"
              error={resetErrors.email}
              autoComplete="email"
            />

            <div>
              <AuthButton type="submit" isLoading={loading} fullWidth>
                {t('auth.sendResetLink', 'Odoslať link na obnovu hesla')}
              </AuthButton>
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-sm font-medium text-black hover:text-gray-700"
              >
                {t('auth.backToLogin', 'Späť na prihlásenie')}
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
        {error && <AuthErrorHandler error={error} />}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            type="button"
            className={`py-2 px-4 text-center w-1/3 font-medium text-sm ${
              activeTab === 'login'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('login')}
          >
            {t('auth.signIn', 'Prihlásiť sa')}
          </button>
          <button
            type="button"
            className={`py-2 px-4 text-center w-1/3 font-medium text-sm ${
              activeTab === 'register'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('register')}
          >
            {t('auth.signUp', 'Registrovať sa')}
          </button>
          <button
            type="button"
            className={`py-2 px-4 text-center w-1/3 font-medium text-sm ${
              activeTab === 'reset'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('reset')}
          >
            {t('auth.resetPassword', 'Obnoviť heslo')}
          </button>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </AuthLayout>
  );
}

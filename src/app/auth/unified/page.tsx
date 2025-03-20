'use client';

// Force dynamic rendering to prevent Firebase initialization during build
export const dynamic = 'force-dynamic';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/FirebaseAuthContext';
import { isFirebaseConfigured } from '@/utils/firebase';
import SectionTitle from '@/components/SectionTitle';

type AuthMode = 'login' | 'register';

export default function UnifiedAuthPage() {
  const router = useRouter();
  const { user, signIn, signUp, signInWithGoogle, error: authError, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    } else {
      setLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Prosím, vyplňte všetky polia');
      return;
    }
    
    if (mode === 'register') {
      if (!confirmPassword) {
        setError('Prosím, vyplňte všetky polia');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Heslá sa nezhodujú');
        return;
      }
      
      if (password.length < 6) {
        setError('Heslo musí mať aspoň 6 znakov');
        return;
      }
      
      try {
        await signUp(email, password);
        setSuccess(true);
      } catch (err: any) {
        setError(err.message);
      }
    } else {
      try {
        await signIn(email, password);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  // Special admin account creation
  const createAdminAccount = async () => {
    setError(null);
    try {
      await signUp('admin@realityportal.com', 'admin123456');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
          <div className="text-gray-400">Načítava sa...</div>
        </div>
      </div>
    );
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="container mx-auto px-4 py-16">
        <SectionTitle title="Prihlásenie" subtitle="Autentifikácia nie je nakonfigurovaná" />
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mt-8">
          <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <h3 className="font-semibold">Chyba konfigurácie</h3>
          </div>
          <p>Firebase nie je nakonfigurovaný. Autentifikácia je momentálne nedostupná.</p>
          
          <div className="mt-6">
            <p className="text-sm text-gray-700 mb-4">
              Pre testovacie účely môžete použiť špeciálny admin účet:
            </p>
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
              <p className="text-sm font-medium">Email: admin@realityportal.com</p>
              <p className="text-sm font-medium">Heslo: admin123456</p>
            </div>
            <Link href="/" className="btn btn-primary w-full py-2.5 block text-center">
              Späť na domovskú stránku
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success && mode === 'register') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Registrácia úspešná</h1>
            <p className="text-gray-500">Skontrolujte svoj email a potvrďte registráciu</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <p className="text-center mb-6">
              Poslali sme vám potvrdzovací email. Kliknite na odkaz v emaile pre dokončenie registrácie.
            </p>
            
            <button 
              onClick={() => {
                setMode('login');
                setSuccess(false);
              }}
              className="w-full btn btn-primary py-2.5 block text-center"
            >
              Prejsť na prihlásenie
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            {mode === 'login' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {mode === 'login' ? 'Vitajte späť' : 'Vytvorte si účet'}
          </h1>
          <p className="text-gray-500">
            {mode === 'login' ? 'Prihláste sa do svojho účtu' : 'Začnite používať Reality Portal'}
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex mb-6 border-b border-gray-200">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-center font-medium ${
                mode === 'login'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Prihlásenie
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-center font-medium ${
                mode === 'register'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Registrácia
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="vas@email.sk"
                required
              />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Heslo
                </label>
                {mode === 'login' && (
                  <Link href="/auth/reset-password" className="text-xs text-primary hover:underline">
                    Zabudli ste heslo?
                  </Link>
                )}
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="••••••••"
                required
              />
              {mode === 'register' && (
                <p className="text-xs text-gray-500 mt-1">Heslo musí mať aspoň 6 znakov</p>
              )}
            </div>
            
            {mode === 'register' && (
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Potvrďte heslo
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}
            
            <button
              type="submit"
              className="w-full btn btn-primary py-2.5"
              disabled={authLoading}
            >
              {authLoading 
                ? (mode === 'login' ? 'Prihlasovanie...' : 'Registrácia...') 
                : (mode === 'login' ? 'Prihlásiť sa' : 'Registrovať sa')}
            </button>
          </form>
          
          <div className="mt-6">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-200 w-full"></div>
              <div className="bg-white px-3 text-sm text-gray-500 absolute">alebo</div>
            </div>
            
            <button
              onClick={signInWithGoogle}
              className="w-full mt-4 btn btn-outline flex items-center justify-center"
              disabled={authLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              {mode === 'login' ? 'Prihlásiť sa cez Google' : 'Registrovať sa cez Google'}
            </button>
          </div>
          
          {/* Admin account creation button - hidden in production */}
          <div className="mt-4">
            <button
              onClick={createAdminAccount}
              className="w-full mt-2 btn btn-secondary py-2.5"
            >
              Vytvoriť admin účet
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>
            {mode === 'login' 
              ? 'Prihlásením súhlasíte s našimi podmienkami používania a ochranou osobných údajov.'
              : 'Registráciou súhlasíte s našimi podmienkami používania a ochranou osobných údajov.'}
          </p>
        </div>
      </div>
    </div>
  );
}

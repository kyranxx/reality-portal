'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';
import { useAuth } from '@/utils/AuthContext';
import SectionTitle from '@/components/SectionTitle';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
          <div className="text-gray-400">Načítava sa...</div>
        </div>
      </div>
    );
  }

  if (!isSupabaseConfigured) {
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
          <p>Supabase nie je nakonfigurovaný. Kontaktujte administrátora.</p>
        </div>
      </div>
    );
  }

  // Custom theme for Supabase Auth UI
  const customTheme = {
    ...ThemeSupa,
    default: {
      colors: {
        brand: '#4F46E5',
        brandAccent: '#6366F1',
        brandButtonText: 'white',
        inputBackground: 'white',
        inputBorder: '#E5E7EB',
        inputBorderFocus: '#4F46E5',
        inputBorderHover: '#D1D5DB',
        inputText: '#374151',
        inputLabelText: '#4B5563',
        inputPlaceholder: '#9CA3AF',
      },
      space: {
        buttonPadding: '10px 15px',
        inputPadding: '10px 15px',
      },
      borderWidths: {
        buttonBorderWidth: '1px',
        inputBorderWidth: '1px',
      },
      radii: {
        borderRadiusButton: '9999px',
        buttonBorderRadius: '9999px',
        inputBorderRadius: '0.5rem',
      },
      fontSizes: {
        baseBodySize: '14px',
        baseInputSize: '14px',
        baseLabelSize: '14px',
        baseButtonSize: '14px',
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Vitajte späť</h1>
          <p className="text-gray-500">Prihláste sa do svojho účtu</p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: customTheme }}
            providers={['google']}
            redirectTo={`${window.location.origin}/auth/callback`}
            theme="default"
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Heslo',
                  button_label: 'Prihlásiť sa',
                  loading_button_label: 'Prihlasovanie...',
                  social_provider_text: 'Prihlásiť sa cez {{provider}}',
                  link_text: 'Máte už účet? Prihláste sa',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Heslo',
                  button_label: 'Registrovať sa',
                  loading_button_label: 'Registrácia...',
                  social_provider_text: 'Registrovať sa cez {{provider}}',
                  link_text: 'Nemáte účet? Registrujte sa',
                },
                forgotten_password: {
                  email_label: 'Email',
                  password_label: 'Heslo',
                  button_label: 'Obnoviť heslo',
                  loading_button_label: 'Odosielanie inštrukcií...',
                  link_text: 'Zabudli ste heslo?',
                },
              },
            }}
          />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Nemáte účet?{' '}
              <Link href="/auth/register" className="text-primary font-medium hover:underline transition-colors">
                Registrujte sa
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Prihlásením súhlasíte s našimi podmienkami používania a ochranou osobných údajov.</p>
        </div>
      </div>
    </div>
  );
}

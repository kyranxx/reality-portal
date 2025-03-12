'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';
import { useAuth } from '@/utils/AuthContext';
import SectionTitle from '@/components/SectionTitle';

export default function ResetPasswordPage() {
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
        <SectionTitle title="Obnovenie hesla" subtitle="Autentifikácia nie je nakonfigurovaná" />
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Obnovenie hesla</h1>
          <p className="text-gray-500">Pošleme vám inštrukcie na obnovenie hesla</p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: customTheme }}
            view="forgotten_password"
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
                  button_label: 'Odoslať inštrukcie',
                  loading_button_label: 'Odosielanie inštrukcií...',
                  link_text: 'Zabudli ste heslo?',
                  confirmation_text: 'Skontrolujte svoj email pre inštrukcie na obnovenie hesla',
                },
              },
            }}
          />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              <Link href="/auth/login" className="text-primary font-medium hover:underline transition-colors">
                Späť na prihlásenie
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

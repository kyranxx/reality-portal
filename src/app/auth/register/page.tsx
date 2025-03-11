'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase, isSupabaseConfigured } from '@/utils/supabase';
import { useAuth } from '@/utils/AuthContext';
import SectionTitle from '@/components/SectionTitle';

export default function RegisterPage() {
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
    return <div className="flex justify-center items-center min-h-screen">Načítava sa...</div>;
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SectionTitle title="Registrácia" subtitle="Autentifikácia nie je nakonfigurovaná" />
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Supabase nie je nakonfigurovaný. Kontaktujte administrátora.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle title="Registrácia" subtitle="Vytvorte si nový účet" />
      
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
          redirectTo={`${window.location.origin}/auth/callback`}
          view="sign_up"
          theme="light"
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
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Máte už účet?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Prihláste sa
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

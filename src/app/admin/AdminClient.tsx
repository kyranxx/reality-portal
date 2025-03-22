'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/FirebaseAuthContext';
import { useApp, Language, ThemeType, themes } from '@/contexts/AppContext';
import SectionTitle from '@/components/SectionTitle';
import AuthErrorBoundary from '@/components/AuthErrorBoundary';

// Admin emails that are allowed to access this page
const ADMIN_EMAILS = ['admin@example.com', 'admin@realityportal.com'];

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

function AdminClientContent() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Skip authentication check during server-side rendering
    if (!isClient) {
      setLoading(false);
      return;
    }

    if (!user && !authLoading) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      // Check if user is admin
      const userIsAdmin = user.email ? ADMIN_EMAILS.includes(user.email) : false;
      setIsAdmin(userIsAdmin);

      if (!userIsAdmin) {
        // Redirect non-admin users
        router.push('/dashboard');
      }

      setLoading(false);
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, router, authLoading]);

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

  if (!user || !isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle title="Admin Panel" subtitle="Správa portálu" />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Štatistiky</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="text-gray-600">Používateľov</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="text-gray-600">Nehnuteľností</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="text-3xl font-bold text-purple-600">0</div>
            <div className="text-gray-600">Správ</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Používatelia</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meno
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registrovaný
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcie
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={4}>
                  Žiadni používatelia
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Nehnuteľnosti</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Názov
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Typ
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cena
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Používateľ
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcie
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={5}>
                  Žiadne nehnuteľnosti
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Nastavenia webu</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Jazyk</h3>
            <LanguageSelector />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Dizajn</h3>
            <ThemeSelector />
          </div>
        </div>
      </div>
    </div>
  );
}

// Language selector component
function LanguageSelector() {
  const { language, setLanguage, t } = useApp();
  
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setLanguage('en')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            language === 'en' 
              ? 'bg-primary text-white border-primary' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {t('languages.en')}
        </button>
        <button
          onClick={() => setLanguage('cs')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            language === 'cs' 
              ? 'bg-primary text-white border-primary' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {t('languages.cs')}
        </button>
        <button
          onClick={() => setLanguage('hu')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            language === 'hu' 
              ? 'bg-primary text-white border-primary' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {t('languages.hu')}
        </button>
        <button
          onClick={() => setLanguage('sk')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            language === 'sk' 
              ? 'bg-primary text-white border-primary' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {t('settings.languageOptions.sk')}
        </button>
      </div>
      <p className="text-sm text-gray-500">
        Aktuálny jazyk: <span className="font-medium">{t(`languages.${language}`)}</span>
      </p>
    </div>
  );
}

// Theme selector component
function ThemeSelector() {
  const { theme, setTheme, t } = useApp();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Object.entries(themes).map(([themeId, themeObj]) => (
          <button
            key={themeId}
            onClick={() => setTheme(themeId as ThemeType)}
            className={`relative p-3 rounded-lg border transition-all ${
              theme.id === themeId 
                ? 'border-primary ring-2 ring-primary/20' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center mb-2">
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: themeObj.colors.primary }}
              ></div>
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: themeObj.colors.secondary }}
              ></div>
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: themeObj.colors.accent }}
              ></div>
            </div>
            <div className="text-sm font-medium">{t(`themes.${themeId}`)}</div>
            {theme.id === themeId && (
              <div className="absolute top-2 right-2 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500">
        Aktuálny dizajn: <span className="font-medium">{t(`themes.${theme.id}`)}</span>
      </p>
    </div>
  );
}

export default function AdminClient() {
  return (
    <AuthErrorBoundary>
      <AdminClientContent />
    </AuthErrorBoundary>
  );
}

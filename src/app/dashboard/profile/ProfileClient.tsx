'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/FirebaseAuthContext';
import SectionTitle from '@/components/SectionTitle';
import { getUserById, updateUser } from '@/utils/firestore';
import AuthErrorBoundary from '@/components/AuthErrorBoundary';

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

function ProfileClientContent() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

    const fetchProfile = async () => {
      if (!user) return;

      try {
        const userData = await getUserById(user.uid);
        if (userData) {
          setName(userData.name || '');
          setPhone(userData.phone || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Nastala chyba pri načítaní profilu');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, router, authLoading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      await updateUser(user.uid, {
        name,
        phone,
      });

      setSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Nastala chyba pri ukladaní profilu');
    } finally {
      setSaving(false);
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

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle title="Profil používateľa" subtitle="Upravte svoje osobné údaje" />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <p>Profil bol úspešne aktualizovaný</p>
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
                value={user.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email nemôžete zmeniť</p>
            </div>

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Meno a priezvisko
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Zadajte vaše meno a priezvisko"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefónne číslo
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="+421 XXX XXX XXX"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => router.push('/dashboard')}
              >
                Späť
              </button>

              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
                disabled={saving}
              >
                {saving ? 'Ukladá sa...' : 'Uložiť zmeny'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ProfileClient() {
  return (
    <AuthErrorBoundary>
      <ProfileClientContent />
    </AuthErrorBoundary>
  );
}

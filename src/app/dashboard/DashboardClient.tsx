'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/FirebaseAuthContext';
import SectionTitle from '@/components/SectionTitle';
import { getUserById } from '@/utils/firestore';

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

export default function DashboardClient() {
  const router = useRouter();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ name?: string; phone?: string } | null>(null);

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
          setProfile({
            name: userData.name,
            phone: userData.phone
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
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

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
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
      <SectionTitle title="Používateľský panel" subtitle="Správa vášho účtu a nehnuteľností" />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profil používateľa</h2>

        <div className="mb-4">
          <p className="text-gray-600">Email:</p>
          <p className="font-medium">{user.email}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">Meno:</p>
          <p className="font-medium">{profile?.name || 'Nenastavené'}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">Telefón:</p>
          <p className="font-medium">{profile?.phone || 'Nenastavené'}</p>
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          onClick={() => router.push('/dashboard/profile')}
        >
          Upraviť profil
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Moje nehnuteľnosti</h2>

        <div className="flex justify-between items-center">
          <p className="text-gray-600">Spravujte svoje nehnuteľnosti</p>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            onClick={() => router.push('/pridat-nehnutelnost')}
          >
            Pridať nehnuteľnosť
          </button>
        </div>

        <div className="mt-4 text-center py-8 border border-gray-200 rounded">
          <p className="text-gray-500">Zatiaľ nemáte žiadne nehnuteľnosti</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Obľúbené nehnuteľnosti</h2>

        <div className="mt-4 text-center py-8 border border-gray-200 rounded">
          <p className="text-gray-500">Zatiaľ nemáte žiadne obľúbené nehnuteľnosti</p>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors"
          onClick={handleSignOut}
        >
          Odhlásiť sa
        </button>
      </div>
    </div>
  );
}

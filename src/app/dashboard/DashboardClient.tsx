'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/FirebaseAuthContext';
import SectionTitle from '@/components/SectionTitle';
import { getUserById } from '@/utils/firebase/firestore';
import AuthErrorBoundary from '@/components/AuthErrorBoundary';
import PropertySection from './PropertySection';

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

function DashboardClientContent() {
  const router = useRouter();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ name?: string; phone?: string } | null>(null);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Skip authentication check during server-side rendering
    if (!isClient) {
      setLoading(false);
      return;
    }

    // Check if authentication is still loading
    if (authLoading) {
      return; // Wait for auth to finish loading before making decisions
    }

    // If user is not authenticated and auth loading is complete, redirect to login
    if (!user) {
      console.log('No authenticated user found, redirecting to login');
      router.push('/auth/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        // First, make sure we have a user object
        if (!user) return;

        // Improved user ID extraction with better logging
        let extractedUserId: string = '';
        
        if (user && typeof user === 'object' && 'uid' in user) {
          extractedUserId = user.uid as string;
        } else if (user && typeof user === 'object' && 'id' in user) {
          extractedUserId = (user as any).id as string;
        } else if (typeof user === 'string') {
          extractedUserId = user;
        } else if (user && typeof user === 'object' && 'email' in user) {
          // Fallback to email-based lookup if needed
          const userWithEmail = user as {email: string};
          console.log('Using email-based user lookup with email:', userWithEmail.email);
        }
        
        if (!extractedUserId) {
          console.error('Unable to determine user ID', user);
          setLoading(false);
          return;
        }
        
        // Update the component state with the user ID
        setUserId(extractedUserId);
        
        console.log('Fetching profile for user ID:', extractedUserId);
        const userData = await getUserById(extractedUserId);
        
        if (userData) {
          setProfile({
            name: userData.name,
            phone: userData.phone,
          });
        } else {
          console.log('No user data found for ID:', extractedUserId);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only try to fetch the profile if we have a user
    if (user) {
      fetchProfile();
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

  // Safe way to extract email from user object which may have different shapes
  const getUserEmail = () => {
    if (!user) return 'N/A';
    
    if (typeof user === 'object') {
      if ('email' in user) return user.email as string;
      if ('emailAddress' in user) return (user as any).emailAddress;
    }
    
    return 'N/A';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle title="Používateľský panel" subtitle="Správa vášho účtu a nehnuteľností" />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profil používateľa</h2>

        <div className="mb-4">
          <p className="text-gray-600">Email:</p>
          <p className="font-medium">{getUserEmail()}</p>
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

      {/* Property section with listing and management */}
      {userId && <PropertySection userId={userId} />}

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

export default function DashboardClient() {
  return (
    <AuthErrorBoundary>
      <DashboardClientContent />
    </AuthErrorBoundary>
  );
}

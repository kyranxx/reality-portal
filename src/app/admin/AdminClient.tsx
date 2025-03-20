'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/FirebaseAuthContext';
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

      <div className="bg-white rounded-lg shadow-md p-6">
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

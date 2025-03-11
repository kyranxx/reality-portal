'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';
import SectionTitle from '@/components/SectionTitle';
import { supabase } from '@/utils/supabase';

type UserStats = {
  total: number;
  newToday: number;
  newThisWeek: number;
  newThisMonth: number;
};

type PropertyStats = {
  total: number;
  active: number;
  sold: number;
  rented: number;
  inactive: number;
  newToday: number;
};

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    newToday: 0,
    newThisWeek: 0,
    newThisMonth: 0,
  });
  const [propertyStats, setPropertyStats] = useState<PropertyStats>({
    total: 0,
    active: 0,
    sold: 0,
    rented: 0,
    inactive: 0,
    newToday: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const checkAdminStatus = async () => {
      try {
        // For demo purposes, we'll consider the first user as admin
        // In a real app, you would check against a list of admin users or a role field
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .order('created_at', { ascending: true })
          .limit(1)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else if (data) {
          setIsAdmin(data.id === user.id);
        }

        if (data && data.id === user.id) {
          await fetchStats();
          await fetchRecentUsers();
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, router]);

  const fetchStats = async () => {
    try {
      // Get user stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString();

      // Total users
      const { count: totalUsers, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // New users today
      const { count: newUsersToday, error: todayError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      // New users this week
      const { count: newUsersWeek, error: weekError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo);

      // New users this month
      const { count: newUsersMonth, error: monthError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthAgo);

      if (!userError && !todayError && !weekError && !monthError) {
        setUserStats({
          total: totalUsers || 0,
          newToday: newUsersToday || 0,
          newThisWeek: newUsersWeek || 0,
          newThisMonth: newUsersMonth || 0,
        });
      }

      // Get property stats
      const { count: totalProperties, error: propError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      const { count: activeProperties, error: activeError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: soldProperties, error: soldError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'sold');

      const { count: rentedProperties, error: rentedError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rented');

      const { count: inactiveProperties, error: inactiveError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'inactive');

      const { count: newPropertiesToday, error: newPropError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      if (!propError && !activeError && !soldError && !rentedError && !inactiveError && !newPropError) {
        setPropertyStats({
          total: totalProperties || 0,
          active: activeProperties || 0,
          sold: soldProperties || 0,
          rented: rentedProperties || 0,
          inactive: inactiveProperties || 0,
          newToday: newPropertiesToday || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, phone, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        throw error;
      }

      setRecentUsers(data || []);
    } catch (error) {
      console.error('Error fetching recent users:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Načítava sa...</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SectionTitle title="Prístup zamietnutý" subtitle="Nemáte oprávnenie na zobrazenie tejto stránky" />
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Táto stránka je dostupná iba pre administrátorov.</p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Späť na domovskú stránku
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle title="Administrátorský panel" subtitle="Správa portálu a štatistiky" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Štatistiky používateľov</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Celkový počet</p>
              <p className="text-2xl font-bold">{userStats.total}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Noví dnes</p>
              <p className="text-2xl font-bold">{userStats.newToday}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600">Noví tento týždeň</p>
              <p className="text-2xl font-bold">{userStats.newThisWeek}</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600">Noví tento mesiac</p>
              <p className="text-2xl font-bold">{userStats.newThisMonth}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Štatistiky nehnuteľností</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Celkový počet</p>
              <p className="text-2xl font-bold">{propertyStats.total}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Aktívne</p>
              <p className="text-2xl font-bold">{propertyStats.active}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600">Predané</p>
              <p className="text-2xl font-bold">{propertyStats.sold}</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600">Prenajané</p>
              <p className="text-2xl font-bold">{propertyStats.rented}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Najnovší používatelia</h2>
        
        {recentUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefón
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dátum registrácie
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name || 'Nenastavené'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.phone || 'Nenastavené'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('sk-SK')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">Žiadni používatelia</div>
        )}
      </div>
      
      <div className="text-center">
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
        >
          Späť na používateľský panel
        </button>
      </div>
    </div>
  );
}

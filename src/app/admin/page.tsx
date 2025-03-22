'use client';

// Using AdminClient directly without the unnecessary wrapper
import AdminClient from './AdminClient';
import NoSSR from '@/components/NoSSR';

// Only force dynamic rendering where absolutely necessary
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return (
    <NoSSR>
      <AdminClient />
    </NoSSR>
  );
}

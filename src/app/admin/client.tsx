'use client';

import AdminClient from './AdminClient';
import NoSSR from '@/components/NoSSR';

export default function AdminClientWrapper() {
  return (
    <NoSSR>
      <AdminClient />
    </NoSSR>
  );
}

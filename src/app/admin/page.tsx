// This is a server component that doesn't use client hooks
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import AdminClient from './AdminClient';

export default function AdminPage() {
  return <AdminClient />;
}

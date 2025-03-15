// This is a server component that will be rendered on the server
// We'll use a special technique to ensure it only renders on the client

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// This is a placeholder component that will be replaced with the actual client component
export default function AdminPage() {
  return null;
}

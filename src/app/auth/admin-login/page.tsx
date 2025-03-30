// Server component that renders the admin login client component
// This is a specialized authentication page for administrators only

// Import the client component that contains the login form and logic
import AdminLoginClient from './AdminLoginClientComponent';

// Force dynamic rendering to prevent caching of admin login page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Ensure the page is never statically rendered during build
export const generateStaticParams = () => {
  return [];
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}

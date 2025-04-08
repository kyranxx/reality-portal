// Server component that uses the Universal Component Loader
import AddPropertyClient from './AddPropertyClient';

// Disable static rendering and force dynamic for Vercel production
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Ensure the page is never statically rendered during build
export const generateStaticParams = () => {
  return [];
};

export default function Page() {
  return <AddPropertyClient />;
}

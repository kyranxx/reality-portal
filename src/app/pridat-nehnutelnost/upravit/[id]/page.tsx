// Dynamic page for editing properties
import EditPropertyClient from './EditPropertyClient';

// Disable static rendering and force dynamic for Vercel production
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Ensure the page is never statically rendered during build
export const generateStaticParams = () => {
  return [];
};

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  return <EditPropertyClient propertyId={params.id} />;
}

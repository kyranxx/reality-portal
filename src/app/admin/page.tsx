// Server component that uses the ClientComponentLoader
import ClientComponentLoader from '@/components/ClientComponentLoader';

// Force dynamic rendering for authenticated admin pages
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  // Use the ClientComponentLoader with the path to the AdminClient component
  return (
    <ClientComponentLoader 
      componentPath="app/admin/AdminClient" 
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
            <div className="text-gray-400">Načítava sa...</div>
          </div>
        </div>
      }
    />
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPropertiesByUserId, deleteProperty } from '@/utils/firebase/firestore';
import { Property } from '@/utils/firebase';

interface PropertySectionProps {
  userId: string;
}

export default function PropertySection({ userId }: PropertySectionProps) {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const userProperties = await getPropertiesByUserId(userId);
        setProperties(userProperties);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Nastala chyba pri načítaní vašich nehnuteľností.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProperties();
    }
  }, [userId]);

  const openDeleteModal = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setPropertyToDelete(null);
  };

  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteProperty(propertyToDelete);
      
      // Update the local state to remove the deleted property
      setProperties(properties.filter(p => p.id !== propertyToDelete));
      
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting property:', err);
      setError('Nastala chyba pri odstraňovaní nehnuteľnosti.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Moje nehnuteľnosti</h2>
        <div className="animate-pulse flex flex-col">
          <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Moje nehnuteľnosti</h2>
        <Link
          href="/pridat-nehnutelnost"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
        >
          Pridať nehnuteľnosť
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {properties.length === 0 ? (
        <div className="text-center py-8 border border-gray-200 rounded">
          <p className="text-gray-500">Zatiaľ nemáte žiadne nehnuteľnosti</p>
          <p className="text-gray-500 mt-2">Pridajte novú nehnuteľnosť kliknutím na tlačidlo vyššie</p>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <div key={property.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {property.images && property.images.length > 0 ? (
                    <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-8 w-8 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                      </svg>
                    </div>
                  )}
                  <div>
                    <Link href={`/nehnutelnosti/${property.id}`} className="text-lg font-medium hover:text-blue-600">
                      {property.title}
                    </Link>
                    <div className="text-sm text-gray-500 mt-1">
                      {property.location} • {property.area} m² • {property.price.toLocaleString()} €
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 md:self-start">
                  <Link
                    href={`/pridat-nehnutelnost/upravit/${property.id}`}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                  >
                    Upraviť
                  </Link>
                  <button
                    onClick={() => openDeleteModal(property.id)}
                    className="px-3 py-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                  >
                    Odstrániť
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Odstrániť nehnuteľnosť</h3>
            <p className="mb-6">Ste si istý, že chcete odstrániť túto nehnuteľnosť? Táto akcia sa nedá vrátiť späť.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Zrušiť
              </button>
              <button
                onClick={handleDeleteProperty}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Odstraňujem...' : 'Odstrániť'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

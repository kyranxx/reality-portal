'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../utils/FirebaseAuthContext';
import { getPropertyById, deleteProperty, updateProperty } from '../../../utils/firestore';
import NoSSR from '../../../components/NoSSR';

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (!params.id) return;
        
        const propertyId = Array.isArray(params.id) ? params.id[0] : params.id;
        const propertyData = await getPropertyById(propertyId);
        
        if (!propertyData) {
          setError('Nehnuteľnosť nebola nájdená');
          setLoading(false);
          return;
        }
        
        setProperty(propertyData);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Nastala chyba pri načítaní nehnuteľnosti');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  const handleEdit = () => {
    if (!property) return;
    router.push(`/pridat-nehnutelnost/edit/${property.id}`);
  };

  const handleDelete = async () => {
    if (!property || !user) return;
    
    try {
      setIsDeleting(true);
      await deleteProperty(property.id);
      router.push('/nehnutelnosti');
    } catch (err) {
      console.error('Error deleting property:', err);
      setError('Nastala chyba pri odstraňovaní nehnuteľnosti');
      setIsDeleting(false);
    }
  };

  const handleFavorite = async () => {
    if (!property || !user) {
      alert('Pre pridanie do obľúbených sa musíte prihlásiť');
      router.push('/auth/login');
      return;
    }
    
    // In a real app, you would implement favorite functionality here
    alert('Nehnuteľnosť bola pridaná do obľúbených');
  };

  const handleContact = () => {
    // In a real app, you would implement contact functionality here
    alert(`Kontaktujte predajcu: ${property.contactName} (${property.contactEmail})`);
  };

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Chyba</h1>
        <p className="text-red-500 mb-6">{error}</p>
        <button 
          onClick={() => router.push('/nehnutelnosti')}
          className="btn btn-primary"
        >
          Späť na zoznam nehnuteľností
        </button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Nehnuteľnosť nebola nájdená</h1>
        <button 
          onClick={() => router.push('/nehnutelnosti')}
          className="btn btn-primary"
        >
          Späť na zoznam nehnuteľností
        </button>
      </div>
    );
  }

  const isOwner = user && property.userId === user.uid;
  const propertyTypeLabels = {
    apartment: 'Byt',
    house: 'Dom',
    land: 'Pozemok',
    commercial: 'Komerčná nehnuteľnosť',
  };

  return (
    <NoSSR>
      <div className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => router.push('/nehnutelnosti')}
              className="text-gray-500 hover:text-gray-700 mb-2 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Späť na zoznam
            </button>
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <div className="flex items-center mt-2">
              <span className="text-gray-600">{property.location}</span>
              <span className="mx-2">•</span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                {propertyTypeLabels[property.propertyType as keyof typeof propertyTypeLabels]}
              </span>
            </div>
          </div>
          
          <div className="text-3xl font-bold text-primary">
            {property.price.toLocaleString()} €
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Image gallery */}
            <div className="bg-gray-100 rounded-lg overflow-hidden mb-8">
              {property.images && property.images.length > 0 ? (
                <img 
                  src={property.images[0]} 
                  alt={property.title} 
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">Žiadne fotografie</span>
                </div>
              )}
            </div>
            
            {/* Property details */}
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100 mb-8">
              <h2 className="text-xl font-semibold mb-4">Popis nehnuteľnosti</h2>
              <p className="text-gray-700 mb-8 whitespace-pre-line">{property.description}</p>
              
              <h2 className="text-xl font-semibold mb-4">Detaily</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm">Plocha</div>
                  <div className="font-semibold">{property.area} m²</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm">Izby</div>
                  <div className="font-semibold">{property.rooms}</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm">Kúpeľne</div>
                  <div className="font-semibold">{property.bathrooms}</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm">Typ</div>
                  <div className="font-semibold">
                    {propertyTypeLabels[property.propertyType as keyof typeof propertyTypeLabels]}
                  </div>
                </div>
              </div>
              
              {property.features && property.features.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Vybavenie a vlastnosti</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                    {property.features.map((feature: string) => (
                      <div key={feature} className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            {/* Contact info */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mb-6">
              <h2 className="text-xl font-semibold mb-4">Kontaktné údaje</h2>
              
              <div className="mb-4">
                <div className="text-gray-500 text-sm">Kontaktná osoba</div>
                <div className="font-semibold">{property.contactName}</div>
              </div>
              
              {property.contactVisibility === 'all' || property.contactVisibility === 'phone' ? (
                <div className="mb-4">
                  <div className="text-gray-500 text-sm">Telefón</div>
                  <div className="font-semibold">{property.contactPhone}</div>
                </div>
              ) : null}
              
              {property.contactVisibility === 'all' || property.contactVisibility === 'email' ? (
                <div className="mb-4">
                  <div className="text-gray-500 text-sm">Email</div>
                  <div className="font-semibold">{property.contactEmail}</div>
                </div>
              ) : null}
              
              <button
                onClick={handleContact}
                className="btn btn-primary w-full mt-4"
              >
                Kontaktovať
              </button>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleFavorite}
                className="btn btn-outline w-full flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                Pridať do obľúbených
              </button>
              
              {isOwner && (
                <>
                  <button
                    onClick={handleEdit}
                    className="btn btn-outline w-full flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Upraviť inzerát
                  </button>
                  
                  <button
                    onClick={() => setShowConfirmDelete(true)}
                    className="btn btn-outline btn-error w-full flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Odstrániť inzerát
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Delete confirmation modal */}
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Odstrániť inzerát</h3>
              <p className="mb-6">Ste si istý, že chcete odstrániť tento inzerát? Táto akcia je nevratná.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="btn btn-outline"
                  disabled={isDeleting}
                >
                  Zrušiť
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-error"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Odstraňujem...' : 'Odstrániť'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </NoSSR>
  );
}

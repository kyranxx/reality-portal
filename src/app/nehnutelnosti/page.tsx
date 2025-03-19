'use client';

import { useState, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { getAllProperties } from '@/utils/firestore';
import NoSSR from '@/components/NoSSR';

export default function NehnutelnostiPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    propertyType: '',
    location: '',
    priceRange: '',
    rooms: '',
  });
  
  // Sorting state
  const [sortBy, setSortBy] = useState('newest');
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const allProperties = await getAllProperties();
        setProperties(allProperties);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Nastala chyba pri načítaní nehnuteľností');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFilters({
      ...filters,
      [id]: value,
    });
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  
  const applyFilters = () => {
    // Start with all properties
    let filteredProperties = [...properties];
    
    // Apply property type filter
    if (filters.propertyType) {
      filteredProperties = filteredProperties.filter(
        property => property.propertyType === filters.propertyType
      );
    }
    
    // Apply location filter (case insensitive partial match)
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filteredProperties = filteredProperties.filter(
        property => property.location.toLowerCase().includes(locationLower)
      );
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange.split('-').map(Number);
      
      if (filters.priceRange.endsWith('+')) {
        // Price above a certain value
        const threshold = Number(filters.priceRange.replace('+', ''));
        filteredProperties = filteredProperties.filter(
          property => property.price >= threshold
        );
      } else {
        // Price between min and max
        filteredProperties = filteredProperties.filter(
          property => property.price >= minPrice && (!maxPrice || property.price <= maxPrice)
        );
      }
    }
    
    // Apply rooms filter
    if (filters.rooms) {
      if (filters.rooms.endsWith('+')) {
        // 5+ rooms
        const minRooms = Number(filters.rooms.replace('+', ''));
        filteredProperties = filteredProperties.filter(
          property => property.rooms >= minRooms
        );
      } else {
        // Exact number of rooms
        const rooms = Number(filters.rooms);
        filteredProperties = filteredProperties.filter(
          property => property.rooms === rooms
        );
      }
    }
    
    return filteredProperties;
  };
  
  const applySorting = (properties: any[]) => {
    const sortedProperties = [...properties];
    
    switch (sortBy) {
      case 'newest':
        return sortedProperties.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
      case 'price-asc':
        return sortedProperties.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sortedProperties.sort((a, b) => b.price - a.price);
      case 'size-asc':
        return sortedProperties.sort((a, b) => a.area - b.area);
      case 'size-desc':
        return sortedProperties.sort((a, b) => b.area - a.area);
      default:
        return sortedProperties;
    }
  };
  
  const filteredProperties = applyFilters();
  const sortedProperties = applySorting(filteredProperties);
  
  return (
    <NoSSR>
      <div className="container py-16">
        <h1 className="text-3xl font-bold mb-2">Nehnuteľnosti</h1>
        <p className="text-gray-600 mb-8">Prehliadajte všetky dostupné nehnuteľnosti</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="col-span-1 md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Filtrovať výsledky</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">Typ nehnuteľnosti</label>
                  <select
                    id="propertyType"
                    value={filters.propertyType}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Všetky typy</option>
                    <option value="apartment">Byty</option>
                    <option value="house">Domy</option>
                    <option value="land">Pozemky</option>
                    <option value="commercial">Komerčné</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Lokalita</label>
                  <input
                    type="text"
                    id="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Mesto, okres alebo PSČ"
                  />
                </div>
                
                <div>
                  <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">Cenové rozpätie</label>
                  <select
                    id="priceRange"
                    value={filters.priceRange}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Bez obmedzenia</option>
                    <option value="0-50000">do 50 000 €</option>
                    <option value="50000-100000">50 000 € - 100 000 €</option>
                    <option value="100000-200000">100 000 € - 200 000 €</option>
                    <option value="200000-300000">200 000 € - 300 000 €</option>
                    <option value="300000+">nad 300 000 €</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-1">Počet izieb</label>
                  <select
                    id="rooms"
                    value={filters.rooms}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Všetky</option>
                    <option value="1">1 izbový</option>
                    <option value="2">2 izbový</option>
                    <option value="3">3 izbový</option>
                    <option value="4">4 izbový</option>
                    <option value="5+">5 a viac izieb</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-gray-600">
                  {loading ? 'Načítavam...' : `Nájdených ${sortedProperties.length} nehnuteľností`}
                </span>
              </div>
              <div>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="newest">Najnovšie</option>
                  <option value="price-asc">Cena (od najnižšej)</option>
                  <option value="price-desc">Cena (od najvyššej)</option>
                  <option value="size-asc">Plocha (od najmenšej)</option>
                  <option value="size-desc">Plocha (od najväčšej)</option>
                </select>
              </div>
            </div>
          </div>
          
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                <div className="bg-white p-5 rounded-b-lg border border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-1 md:col-span-3 text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Skúsiť znova
              </button>
            </div>
          ) : sortedProperties.length === 0 ? (
            <div className="col-span-1 md:col-span-3 text-center py-12">
              <p className="text-gray-500 mb-4">Neboli nájdené žiadne nehnuteľnosti zodpovedajúce vašim kritériám</p>
              <button 
                onClick={() => setFilters({
                  propertyType: '',
                  location: '',
                  priceRange: '',
                  rooms: '',
                })}
                className="btn btn-outline"
              >
                Zrušiť filtre
              </button>
            </div>
          ) : (
            sortedProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                id={property.id}
                title={property.title}
                location={property.location}
                price={property.price}
                size={property.area}
                bedrooms={property.rooms}
                bathrooms={property.bathrooms}
                landSize={property.landSize}
                imageUrl={property.images && property.images.length > 0 ? property.images[0] : ''}
                isFeatured={property.isFeatured}
                isNew={property.isNew}
                type={property.propertyType}
              />
            ))
          )}
        </div>
        
        {/* Pagination - simplified for now */}
        {!loading && !error && sortedProperties.length > 0 && (
          <div className="flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Predchádzajúca
              </a>
              <a
                href="#"
                className="px-4 py-2 border-t border-b border-gray-300 bg-primary text-white"
              >
                1
              </a>
              <a
                href="#"
                className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                2
              </a>
              <a
                href="#"
                className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                3
              </a>
              <a
                href="#"
                className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Ďalšia
              </a>
            </nav>
          </div>
        )}
      </div>
    </NoSSR>
  );
}

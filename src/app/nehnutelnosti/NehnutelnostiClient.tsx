'use client';

import React, { useEffect, useState } from 'react';
import SectionTitle from '@/components/SectionTitle';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/utils/firebase';
import { getAllProperties } from '@/utils/firestore';
import { featuredProperties as sampleProperties } from '@/data/sampleProperties';

export default function NehnutelnostiClient() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: 'all',
    priceMin: 0,
    priceMax: 1000000,
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const allProperties = await getAllProperties();
        setProperties(allProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        // Fallback to sample data if Firebase is not configured
        setProperties(sampleProperties as unknown as Property[]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleFilterChange = (newFilter: any) => {
    setFilter({ ...filter, ...newFilter });
  };

  const filteredProperties = properties.filter((property) => {
    if (filter.type !== 'all' && property.propertyType !== filter.type) {
      return false;
    }
    
    if (property.price < filter.priceMin || property.price > filter.priceMax) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
          <div className="text-gray-400">Načítava sa...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle 
        title="Nehnuteľnosti" 
        subtitle="Prehliadajte dostupné nehnuteľnosti v našej ponuke" 
      />
      
      <div className="mb-8">
        <SearchBar />
      </div>
      
      <div className="flex flex-wrap mb-8">
        <button 
          onClick={() => handleFilterChange({ type: 'all' })}
          className={`px-4 py-2 mr-2 mb-2 rounded ${
            filter.type === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Všetky
        </button>
        <button 
          onClick={() => handleFilterChange({ type: 'apartment' })}
          className={`px-4 py-2 mr-2 mb-2 rounded ${
            filter.type === 'apartment' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Byty
        </button>
        <button 
          onClick={() => handleFilterChange({ type: 'house' })}
          className={`px-4 py-2 mr-2 mb-2 rounded ${
            filter.type === 'house' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Domy
        </button>
        <button 
          onClick={() => handleFilterChange({ type: 'commercial' })}
          className={`px-4 py-2 mr-2 mb-2 rounded ${
            filter.type === 'commercial' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Komerčné
        </button>
        <button 
          onClick={() => handleFilterChange({ type: 'land' })}
          className={`px-4 py-2 mr-2 mb-2 rounded ${
            filter.type === 'land' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Pozemky
        </button>
      </div>
      
      {filteredProperties.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-600">Žiadne nehnuteľnosti na zobrazenie</h3>
          <p className="text-gray-500 mt-2">Skúste zmeniť filtre alebo sa vráťte neskôr</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
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
              imageUrl={property.images?.[0] || ''}
              isFeatured={property.isFeatured}
              isNew={property.isNew}
              type={property.propertyType}
            />
          ))}
        </div>
      )}
    </div>
  );
}

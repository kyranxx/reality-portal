'use client';

import React from 'react';
import { UnifiedProperty } from '@/services/propertyService';
import ServerPropertyProvider from '@/components/ServerPropertyProvider';
import { SkeletonPropertyCard } from '@/components/skeletons/SkeletonPropertyCard';
import { useProperties } from '@/hooks/useProperties';

export default function NehnutelnostiClient() {
  const { properties, isLoading, isError } = useProperties();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonPropertyCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Failed to load properties</p>
          <p>Using fallback data...</p>
        </div>
        <ServerPropertyProvider>
          {({ allProperties }) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {allProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </ServerPropertyProvider>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No properties found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}

interface PropertyCardProps {
  property: UnifiedProperty;
}

function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="h-48 bg-gray-200 relative">
        {property.imageUrl ? (
          <img 
            src={property.imageUrl} 
            alt={property.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
        <p className="text-gray-600 mb-1">{property.location}</p>
        <p className="text-gray-800 font-bold">€{property.price.toLocaleString()}</p>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>{property.size} m²</span>
          {property.bedrooms && <span>{property.bedrooms} izby</span>}
        </div>
        <a 
          href={`/nehnutelnosti/${property.id}`}
          className="mt-3 block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Detail
        </a>
      </div>
    </div>
  );
}

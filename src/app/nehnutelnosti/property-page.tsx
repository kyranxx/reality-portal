'use client';

import React from 'react';
import { UnifiedProperty } from '@/services/propertyService';
import { SkeletonPropertyDetail } from '@/components/skeletons/SkeletonPropertyDetail';
import { useProperty } from '@/hooks/useProperties';

interface PropertyPageProps {
  propertyId: string;
  fallbackProperty?: UnifiedProperty; // Optional fallback from server
}

export default function PropertyPage({ propertyId, fallbackProperty }: PropertyPageProps) {
  const { property, isLoading, isError } = useProperty(propertyId);
  
  // Use fallbackProperty when available
  const displayProperty = property || fallbackProperty;
  
  if (isLoading) {
    return <SkeletonPropertyDetail />;
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Failed to load property details</p>
        </div>
      </div>
    );
  }

  if (!displayProperty) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Property not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{displayProperty.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="bg-gray-200 h-80 rounded-lg mb-4 overflow-hidden">
            {displayProperty.imageUrl && (
              <img 
                src={displayProperty.imageUrl} 
                alt={displayProperty.title} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Details</h2>
              <p className="text-gray-600 mt-2"><strong>Location:</strong> {displayProperty.location}</p>
              <p className="text-gray-600"><strong>Price:</strong> €{displayProperty.price.toLocaleString()}</p>
              <p className="text-gray-600"><strong>Area:</strong> {displayProperty.size} m²</p>
              {displayProperty.bedrooms && <p className="text-gray-600"><strong>Bedrooms:</strong> {displayProperty.bedrooms}</p>}
              {displayProperty.bathrooms && <p className="text-gray-600"><strong>Bathrooms:</strong> {displayProperty.bathrooms}</p>}
              {displayProperty.landSize && <p className="text-gray-600"><strong>Land Size:</strong> {displayProperty.landSize} m²</p>}
              <p className="text-gray-600"><strong>Type:</strong> {displayProperty.type}</p>
            </div>

            <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full">
              Contact Agent
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
        <p className="text-gray-700">{displayProperty.description || 'No description available.'}</p>
      </div>

      {displayProperty.features && displayProperty.features.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {displayProperty.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <span className="mr-2">✓</span> {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

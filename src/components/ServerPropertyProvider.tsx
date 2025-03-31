import React from 'react';
import { featuredProperties, newProperties } from '../data/sampleProperties';

// Use this component in server components to get static property data
// without trying to access Firebase (which is client-only)

type PropertyType = (typeof featuredProperties)[0];

interface ServerPropertyProviderProps {
  children: (props: {
    featuredProperties: PropertyType[];
    newProperties: PropertyType[];
    getPropertyById: (id: string) => PropertyType | undefined;
    allProperties: PropertyType[];
  }) => React.ReactNode;
}

export default function ServerPropertyProvider({ children }: ServerPropertyProviderProps) {
  const allProperties = [...featuredProperties, ...newProperties];
  
  const getPropertyById = (id: string) => {
    return allProperties.find(property => property.id === id);
  };

  return (
    <>
      {children({
        featuredProperties,
        newProperties,
        getPropertyById,
        allProperties,
      })}
    </>
  );
}

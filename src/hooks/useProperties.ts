'use client';

import useSWR from 'swr';
import { getProperties, getPropertyById, UnifiedProperty } from '@/services/propertyService';

export function useProperties() {
  const { data, error, isLoading } = useSWR('all-properties', getProperties);
  
  return {
    properties: data || [],
    isLoading,
    isError: !!error,
  };
}

export function useProperty(id: string) {
  const { data, error, isLoading } = useSWR(`property-${id}`, () => getPropertyById(id));
  
  return {
    property: data,
    isLoading,
    isError: !!error,
  };
}

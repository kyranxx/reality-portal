'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import firebaseService from '@/utils/firebase-service';
import { Property } from '@/utils/firebase';
import Image from 'next/image';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { withFirestoreErrorHandling, getFallbackProperties } from '@/utils/firestore-error-handler';

/**
 * PropertyDetailClient Component
 *
 * Client component for property detail pages with proper data fetching.
 * Replaces the placeholder "Page Content" with actual property details.
 */
export default function PropertyDetailClient() {
  const { id } = useParams() as { id: string };
  const { t } = useApp();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);

  // Fetch property data
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch the property details
        const propertyData = await withFirestoreErrorHandling(
          async () => await firebaseService.getDocument<Property>('properties', id),
          null,
          `getProperty:${id}`
        );

        if (!propertyData) {
          setError(t('errors.propertyNotFound', 'Property not found'));
          setProperty(null);
        } else {
          setProperty(propertyData);

          // Fetch similar properties
          const similar = await withFirestoreErrorHandling(
            async () => {
              const properties = await firebaseService.queryByField<Property>(
                'properties',
                'propertyType',
                propertyData.propertyType
              );
              return properties.filter(p => p.id !== id).slice(0, 3);
            },
            getFallbackProperties(3),
            'getSimilarProperties'
          );

          if (similar) {
            setSimilarProperties(similar);
          } else {
            setSimilarProperties([]);
          }
        }
      } catch (err: any) {
        console.error('Error fetching property:', err);
        setError(err.message || t('errors.unknownError', 'An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPropertyData();
    }
  }, [id, t]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container my-10">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container my-10">
        <div className="p-6 bg-red-50 rounded-lg border border-red-100 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            {t('errors.errorOccurred', 'An error occurred')}
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/nehnutelnosti" className="btn btn-primary">
            {t('errors.backToProperties', 'Back to Properties')}
          </Link>
        </div>
      </div>
    );
  }

  // No property found state
  if (!property) {
    return (
      <div className="container my-10">
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-100 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {t('errors.propertyNotFound', 'Property not found')}
          </h2>
          <p className="text-gray-600 mb-4">
            {t(
              'errors.propertyNotFoundMessage',
              'The property you are looking for could not be found'
            )}
          </p>
          <Link href="/nehnutelnosti" className="btn btn-primary">
            {t('errors.backToProperties', 'Back to Properties')}
          </Link>
        </div>
      </div>
    );
  }

  // Format price with separators
  const formattedPrice = new Intl.NumberFormat('sk-SK').format(property.price);

  return (
    <div className="container my-10 space-y-8">
      {/* Property Header */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{property.title}</h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{property.location}</span>
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span>{t(`property.type.${property.propertyType}`, property.propertyType)}</span>
          </div>
          {property.isNew && (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {t('property.new', 'New')}
            </div>
          )}
        </div>
      </div>

      {/* Property Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 h-[400px] relative rounded-lg overflow-hidden">
          <SafeImage
            src={property.images[0] || '/images/placeholder.jpg'}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {property.images.slice(1, 5).map((img, index) => (
            <div key={index} className="h-[190px] relative rounded-lg overflow-hidden">
              <SafeImage
                src={img}
                alt={`${property.title} ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-2xl font-semibold mb-4">
              {t('propertyDetail.description', 'Description')}
            </h2>
            <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
          </div>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-2xl font-semibold mb-4">
                {t('propertyDetail.features', 'Features')}
              </h2>
              <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
                {property.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Location */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-2xl font-semibold mb-4">
              {t('propertyDetail.location', 'Location')}
            </h2>
            <div className="aspect-video bg-gray-100 rounded-lg relative">
              {/* Map placeholder - could be replaced with an actual map component */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">
                  {t('propertyDetail.mapPlaceholder', 'Map will be displayed here')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-2xl font-semibold text-primary mb-2">{formattedPrice} €</h2>
            <p className="text-gray-500 text-sm mb-6">{t('propertyDetail.price', 'Price')}</p>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('property.area', 'Area')}</span>
                <span className="font-medium">{property.area} m²</span>
              </div>

              {property.rooms && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('property.rooms', 'Rooms')}</span>
                  <span className="font-medium">{property.rooms}</span>
                </div>
              )}

              {property.bathrooms && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('property.bathrooms', 'Bathrooms')}</span>
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
              )}

              {property.landSize && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('property.landSize', 'Land Size')}</span>
                  <span className="font-medium">{property.landSize} m²</span>
                </div>
              )}
            </div>

            <div className="mt-8">
              <button className="btn btn-primary w-full mb-3">
                {t('propertyDetail.contactSeller', 'Contact Seller')}
              </button>
              <button className="btn btn-outline w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                {t('propertyDetail.addToFavorites', 'Add to Favorites')}
              </button>
            </div>
          </div>

          {/* Contact Info */}
          {property.contactName && (
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-xl font-semibold mb-4">
                {t('propertyDetail.contactInformation', 'Contact Information')}
              </h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary mr-3 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">{property.contactName}</p>
                    <p className="text-gray-500 text-sm">{t('propertyDetail.seller', 'Seller')}</p>
                  </div>
                </div>

                {property.contactPhone && (
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary mr-3 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <div>
                      <p className="font-medium">{property.contactPhone}</p>
                      <p className="text-gray-500 text-sm">{t('propertyDetail.phone', 'Phone')}</p>
                    </div>
                  </div>
                )}

                {property.contactEmail && (
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary mr-3 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <div>
                      <p className="font-medium">{property.contactEmail}</p>
                      <p className="text-gray-500 text-sm">{t('propertyDetail.email', 'Email')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="pt-8 border-t">
          <h2 className="text-2xl font-semibold mb-6">
            {t('propertyDetail.similarProperties', 'Similar Properties')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProperties.map(prop => (
              <Link
                href={`/nehnutelnosti/${prop.id}`}
                key={prop.id}
                className="group block bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <SafeImage
                    src={prop.images[0] || '/images/placeholder.jpg'}
                    alt={prop.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {prop.isNew && (
                    <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {t('property.new', 'New')}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-1">
                    {prop.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{prop.location}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-primary">
                      {new Intl.NumberFormat('sk-SK').format(prop.price)} €
                    </p>
                    <p className="text-gray-500 text-sm">{prop.area} m²</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

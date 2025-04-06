'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import SearchBar from '@/components/SearchBar';
import StatsSection from '@/components/home/StatsSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedPropertySection from '@/components/home/FeaturedPropertySection';
import FeaturedPropertiesSection from '@/components/home/FeaturedPropertiesSection';
import CtaSection from '@/components/home/CtaSection';
import { Property } from '@/utils/firebase';
import { getFeaturedProperties } from '@/utils/firestore';
import { featuredProperties as sampleFeaturedProperties } from '@/data/sampleProperties';

// Convert sample property data to match Firebase Property interface
const convertSampleToFirebaseFormat = (sampleProperty: any): Property => {
  return {
    id: sampleProperty.id,
    title: sampleProperty.title,
    description: sampleProperty.title, // Use title as description if missing
    price: sampleProperty.price,
    location: sampleProperty.location,
    area: sampleProperty.size, // Map size to area
    rooms: sampleProperty.bedrooms,
    propertyType: sampleProperty.type, // Map type to propertyType
    userId: 'sample-user-id', // Provide a default userId
    images: sampleProperty.imageUrl ? [sampleProperty.imageUrl] : [], // Convert imageUrl to images array
    isFeatured: sampleProperty.isFeatured || false,
    isNew: sampleProperty.isNew || false,
    bathrooms: sampleProperty.bathrooms,
    landSize: sampleProperty.landSize,
    features: [],
    createdAt: new Date(), // Provide a default createdAt
    contactName: 'Sample Contact',
    contactPhone: '+1234567890',
    contactEmail: 'contact@example.com',
    contactVisibility: 'public'
  };
};

export default function HomeClient() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const featured = await getFeaturedProperties(7); // Get 7 featured properties
        
        if (featured && featured.length > 0) {
          console.log('Using Firestore property data');
          setFeaturedProperties(featured);
        } else {
          throw new Error('No properties found in Firestore');
        }
      } catch (error) {
        console.log('Using sample property data');
        // Transform sample data to match Firebase Property format
        const convertedProperties = sampleFeaturedProperties.map(convertSampleToFirebaseFormat);
        setFeaturedProperties(convertedProperties);
        
        // Only set error if it's not just empty data
        if (error instanceof Error && !error.message.includes('No properties found')) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Show loading indicator
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

  // Show error message if there's an error and no properties
  if (error && featuredProperties.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="text-red-500 mb-4">Error loading properties</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  // Ensure we have properties to display
  if (featuredProperties.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">No properties found</div>
      </div>
    );
  }

  return (
    <>
      {/* Search Bar */}
      <div className="container mt-10">
        <SearchBar />
      </div>

      {/* Stats Section */}
      <StatsSection />

      {/* Property Categories */}
      <CategorySection />

      {/* Featured Property of the Week */}
      <FeaturedPropertySection property={featuredProperties[0]} />

      {/* Featured Properties */}
      <FeaturedPropertiesSection properties={featuredProperties.slice(1, 7)} />

      {/* CTA Section */}
      <CtaSection />
    </>
  );
}

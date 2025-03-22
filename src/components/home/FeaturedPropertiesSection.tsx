'use client';

import Link from 'next/link';
import SectionTitle from '@/components/SectionTitle';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/utils/firebase';

interface FeaturedPropertiesSectionProps {
  properties: Property[];
}

const FeaturedPropertiesSection = ({ properties }: FeaturedPropertiesSectionProps) => {
  return (
    <section className="py-16">
      <div className="container">
        <SectionTitle 
          title="Odporúčané nehnuteľnosti" 
          subtitle="Pozrite si naše najlepšie ponuky"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
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
              imageUrl={property.images?.[0] || '/images/placeholder.txt'}
              isFeatured={property.isFeatured}
              isNew={property.isNew}
              type={property.propertyType}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/nehnutelnosti" className="btn btn-primary shadow-md hover:shadow-lg">
            Zobraziť všetky nehnuteľnosti
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPropertiesSection;

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/utils/firebase';

interface FeaturedPropertySectionProps {
  property: Property;
}

const FeaturedPropertySection = ({ property }: FeaturedPropertySectionProps) => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          <div className="lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src={property.images?.[0] || '/images/placeholder.txt'}
                alt="Featured Property"
                width={600}
                height={400}
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="badge badge-primary shadow-md text-sm px-3 py-1">
                  Nehnuteľnosť týždňa
                </span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Exkluzívna ponuka</span>
            <h2 className="text-3xl font-bold mt-3 mb-4">{property.title}</h2>
            <p className="text-gray-600 mb-6">
              {property.description || 'Luxusná nehnuteľnosť v prestížnej lokalite s výbornou dostupnosťou do centra mesta. Táto nehnuteľnosť ponúka moderné vybavenie, priestranné izby a krásny výhľad na okolie.'}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Lokalita</div>
                  <div className="font-medium">{property.location}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75m-6-1.5H2.25m19.5 0v.75c0 .414-.336.75-.75.75h-.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Cena</div>
                  <div className="font-medium">{property.price.toLocaleString()} €</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Plocha</div>
                  <div className="font-medium">{property.area} m²</div>
                </div>
              </div>
              
              {property.rooms && (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Izby</div>
                    <div className="font-medium">{property.rooms} {property.rooms === 1 ? 'izba' : property.rooms < 5 ? 'izby' : 'izieb'}</div>
                  </div>
                </div>
              )}
            </div>
            
            <Link href={`/nehnutelnosti/${property.id}`} className="btn btn-primary shadow-lg hover:shadow-xl">
              Zobraziť detail
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPropertySection;

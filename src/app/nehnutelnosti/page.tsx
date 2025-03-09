import { featuredProperties, newProperties } from '@/data/sampleProperties';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';

export default function NehnutelnostiPage() {
  // Combine all properties for the listing
  const allProperties = [...featuredProperties, ...newProperties];
  
  return (
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Mesto, okres alebo PSČ"
                />
              </div>
              
              <div>
                <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">Cenové rozpätie</label>
                <select
                  id="priceRange"
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
            
            <div className="mt-6 flex justify-end">
              <button className="btn btn-primary">
                Vyhľadať
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-gray-600">Nájdených {allProperties.length} nehnuteľností</span>
            </div>
            <div>
              <select
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
        
        {allProperties.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>
      
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
    </div>
  );
}

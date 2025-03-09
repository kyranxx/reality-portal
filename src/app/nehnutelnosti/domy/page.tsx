import { featuredProperties } from '@/data/sampleProperties';
import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';

export default function DomyPage() {
  // Filter only house properties
  const houseProperties = featuredProperties.filter(
    (property) => property.type === 'house'
  );
  
  return (
    <div className="container py-16">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-primary">Domov</Link>
        <span>/</span>
        <Link href="/nehnutelnosti" className="hover:text-primary">Nehnuteľnosti</Link>
        <span>/</span>
        <span className="text-gray-700">Domy</span>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Domy na predaj</h1>
      <p className="text-gray-600 mb-8">Rodinné domy a vily pre pohodlné bývanie</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="col-span-1 md:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Filtrovať výsledky</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <option value="0-100000">do 100 000 €</option>
                  <option value="100000-200000">100 000 € - 200 000 €</option>
                  <option value="200000-300000">200 000 € - 300 000 €</option>
                  <option value="300000-500000">300 000 € - 500 000 €</option>
                  <option value="500000+">nad 500 000 €</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-1">Počet izieb</label>
                <select
                  id="rooms"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Všetky</option>
                  <option value="2">2 izbový</option>
                  <option value="3">3 izbový</option>
                  <option value="4">4 izbový</option>
                  <option value="5">5 izbový</option>
                  <option value="6+">6 a viac izieb</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="landSize" className="block text-sm font-medium text-gray-700 mb-1">Plocha pozemku (m²)</label>
                <select
                  id="landSize"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Bez obmedzenia</option>
                  <option value="0-300">do 300 m²</option>
                  <option value="300-600">300 - 600 m²</option>
                  <option value="600-1000">600 - 1000 m²</option>
                  <option value="1000-2000">1000 - 2000 m²</option>
                  <option value="2000+">nad 2000 m²</option>
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
              <span className="text-gray-600">Nájdených {houseProperties.length} domov</span>
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
                <option value="land-asc">Pozemok (od najmenšieho)</option>
                <option value="land-desc">Pozemok (od najväčšieho)</option>
              </select>
            </div>
          </div>
        </div>
        
        {houseProperties.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
        
        {houseProperties.length === 0 && (
          <div className="col-span-1 md:col-span-3 text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenašli sa žiadne domy</h3>
            <p className="text-gray-600">Skúste upraviť filtre alebo sa vráťte neskôr</p>
          </div>
        )}
      </div>
    </div>
  );
}

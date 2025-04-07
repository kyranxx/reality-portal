'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const [searchType, setSearchType] = useState('buy');
  const [propertyType, setPropertyType] = useState('all');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [minSize, setMinSize] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Build query parameters
    const params = new URLSearchParams();
    params.append('type', searchType);
    params.append('propertyType', propertyType);
    
    if (location) params.append('location', location);
    params.append('minPrice', priceRange[0].toString());
    params.append('maxPrice', priceRange[1].toString());
    
    if (minSize) params.append('minSize', minSize);
    if (bedrooms) params.append('bedrooms', bedrooms);
    
    // Navigate to search results page with query params
    router.push(`/nehnutelnosti?${params.toString()}`);
    
    // Log for debugging
    console.log('Search:', {
      searchType,
      propertyType,
      location,
      priceRange,
      minSize: minSize ? parseInt(minSize) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value || '0');
    if (e.target.name === 'minPrice') {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
  };

  return (
    <div className="search-container rounded-xl shadow-lg p-6 -mt-20 relative z-30 border border-gray-100">
      <form onSubmit={handleSubmit}>
        {/* Main search row - prominently displayed */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Type toggle (Buy/Rent) - 2 columns */}
          <div className="md:col-span-2">
            <div className="flex rounded-full overflow-hidden border border-gray-200 p-0.5 bg-white shadow-sm h-full">
              <button
                type="button"
                className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-full transition-all duration-300 ${
                  searchType === 'buy'
                    ? 'bg-black text-white'
                    : 'bg-transparent text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setSearchType('buy')}
              >
                Kúpa
              </button>
              <button
                type="button"
                className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-full transition-all duration-300 ${
                  searchType === 'rent'
                    ? 'bg-black text-white'
                    : 'bg-transparent text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setSearchType('rent')}
              >
                Prenájom
              </button>
            </div>
          </div>
          
          {/* Property Type - 3 columns */}
          <div className="md:col-span-3">
            <div className="relative h-full">
              <select
                id="propertyType"
                value={propertyType}
                onChange={e => setPropertyType(e.target.value)}
                className="form-select block w-full h-full rounded-lg border-gray-200 py-2.5 px-4 pr-10 text-sm bg-white shadow-sm"
              >
                <option value="all">Všetky typy</option>
                <option value="apartment">Byty</option>
                <option value="house">Domy</option>
                <option value="land">Pozemky</option>
                <option value="commercial">Komerčné priestory</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Location - 5 columns */}
          <div className="md:col-span-5">
            <div className="relative h-full">
              <input
                type="text"
                id="location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Mesto, okres alebo PSČ"
                className="form-input block w-full h-full rounded-lg border-gray-200 py-2.5 px-4 pl-10 text-sm shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Search Button - 2 columns */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-full btn btn-primary py-2.5 px-4 text-sm flex items-center justify-center shadow-sm"
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              )}
              Vyhľadať
            </button>
          </div>
        </div>

        {/* Popular locations */}
        <div className="mt-8 flex">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 mr-1">Populárne:</span>
            <button
              type="button"
              onClick={() => setLocation('Bratislava')}
              className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full transition-colors"
            >
              Bratislava
            </button>
            <button
              type="button"
              onClick={() => setLocation('Košice')}
              className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full transition-colors"
            >
              Košice
            </button>
            <button
              type="button"
              onClick={() => setLocation('Žilina')}
              className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full transition-colors"
            >
              Žilina
            </button>
            <button
              type="button"
              onClick={() => setLocation('Nitra')}
              className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full transition-colors"
            >
              Nitra
            </button>
            <button
              type="button"
              onClick={() => setLocation('Prešov')}
              className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full transition-colors"
            >
              Prešov
            </button>
            <button
              type="button"
              onClick={() => setLocation('Banská Bystrica')}
              className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full transition-colors"
            >
              Banská Bystrica
            </button>
            <button
              type="button"
              onClick={() => setLocation('Trnava')}
              className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full transition-colors"
            >
              Trnava
            </button>
            <button
              type="button"
              onClick={() => setLocation('Trenčín')}
              className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full transition-colors"
            >
              Trenčín
            </button>
          </div>
        </div>

        {/* Advanced filters - clearly visible and structured */}
        <div className="mt-8 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cenové rozpätie
            </label>
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  name="minPrice"
                  min="0"
                  value={priceRange[0]}
                  onChange={handlePriceChange}
                  placeholder="Od"
                  className="form-input block w-full rounded-lg border-gray-200 py-2.5 px-4 pr-6 text-sm shadow-sm"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400 text-sm">
                  €
                </div>
              </div>
              <span className="text-gray-400 text-sm">-</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  name="maxPrice"
                  min="0"
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  placeholder="Do"
                  className="form-input block w-full rounded-lg border-gray-200 py-2.5 px-4 pr-6 text-sm shadow-sm"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400 text-sm">
                  €
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="minSize" className="block text-sm font-medium text-gray-700 mb-2">
              Minimálna plocha (m²)
            </label>
            <input
              type="number"
              min="0"
              id="minSize"
              value={minSize}
              onChange={e => setMinSize(e.target.value)}
              placeholder="Minimálna plocha"
              className="form-input block w-full rounded-lg border-gray-200 py-2.5 px-4 text-sm shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
              Počet izieb
            </label>
            <select
              id="bedrooms"
              value={bedrooms}
              onChange={e => setBedrooms(e.target.value)}
              className="form-select block w-full rounded-lg border-gray-200 py-2.5 px-4 text-sm shadow-sm"
            >
              <option value="">Nezáleží</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}

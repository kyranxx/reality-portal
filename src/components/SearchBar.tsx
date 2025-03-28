'use client';
import { useState } from 'react';

export default function SearchBar() {
  const [searchType, setSearchType] = useState('buy');
  const [propertyType, setPropertyType] = useState('all');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minSize, setMinSize] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would redirect to search results
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
    const value = parseInt(e.target.value);
    if (e.target.name === 'minPrice') {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
  };

  return (
    <div className="glass-effect rounded-xl shadow-md p-6 -mt-16 relative z-10 border border-white/30">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Typ vyhľadávania</label>
            <div className="flex rounded-full overflow-hidden border border-gray-200 p-0.5 bg-gray-50">
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-full transition-all duration-300 ${
                  searchType === 'buy'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSearchType('buy')}
              >
                Kúpa
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-full transition-all duration-300 ${
                  searchType === 'rent'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSearchType('rent')}
              >
                Prenájom
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
              Typ nehnuteľnosti
            </label>
            <div className="relative">
              <select
                id="propertyType"
                value={propertyType}
                onChange={e => setPropertyType(e.target.value)}
                className="form-select block w-full rounded-lg border-gray-200 py-2.5 px-4 pr-10 text-sm bg-white appearance-none"
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

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Lokalita
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Mesto, okres alebo PSČ"
                className="form-input block w-full rounded-lg border-gray-200 py-2.5 px-4 pl-10 text-sm"
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

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full btn btn-primary py-2.5 px-4 text-sm flex items-center justify-center"
            >
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
              Vyhľadať
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 mr-1">Populárne:</span>
            <a
              href="#"
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full transition-colors"
            >
              Bratislava
            </a>
            <a
              href="#"
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full transition-colors"
            >
              Košice
            </a>
            <a
              href="#"
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full transition-colors"
            >
              Žilina
            </a>
          </div>

          <button
            type="button"
            className="text-xs text-primary font-medium flex items-center hover:underline"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Skryť' : 'Rozšírené'} vyhľadávanie
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-3 h-3 ml-1 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>

        {/* Advanced search options */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cenové rozpätie
              </label>
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    name="minPrice"
                    value={priceRange[0]}
                    onChange={handlePriceChange}
                    placeholder="Od"
                    className="form-input block w-full rounded-lg border-gray-200 py-2.5 px-3 text-sm"
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
                    value={priceRange[1]}
                    onChange={handlePriceChange}
                    placeholder="Do"
                    className="form-input block w-full rounded-lg border-gray-200 py-2.5 px-3 text-sm"
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
                id="minSize"
                value={minSize}
                onChange={e => setMinSize(e.target.value)}
                placeholder="Minimálna plocha"
                className="form-input block w-full rounded-lg border-gray-200 py-2.5 px-3 text-sm"
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
                className="form-select block w-full rounded-lg border-gray-200 py-2.5 px-3 text-sm"
              >
                <option value="">Nezáleží</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

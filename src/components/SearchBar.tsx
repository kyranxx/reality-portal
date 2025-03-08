"use client";
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
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined
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
    <div className="glass-effect rounded-lg shadow-md p-4 -mt-12 relative z-10 border border-white/20">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Typ vyhľadávania</label>
            <div className="flex rounded-full overflow-hidden border border-gray-200 p-0.5 bg-gray-50">
              <button
                type="button"
                className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-full transition-all duration-200 ${
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
                className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-full transition-all duration-200 ${
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
            <label htmlFor="propertyType" className="block text-xs font-medium text-gray-700 mb-1">
              Typ nehnuteľnosti
            </label>
            <div className="relative">
              <select
                id="propertyType"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="block w-full rounded-md border-gray-200 py-1.5 px-3 pr-8 text-xs focus:border-primary focus:ring-primary bg-white appearance-none shadow-sm"
              >
                <option value="all">Všetky typy</option>
                <option value="apartment">Byty</option>
                <option value="house">Domy</option>
                <option value="land">Pozemky</option>
                <option value="commercial">Komerčné priestory</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-xs font-medium text-gray-700 mb-1">
              Lokalita
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Mesto, okres alebo PSČ"
                className="block w-full rounded-md border-gray-200 py-1.5 px-3 pl-8 text-xs focus:border-primary focus:ring-primary shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-primary text-white rounded-md py-1.5 px-3 text-xs font-medium hover:bg-primary/90 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 mr-1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Vyhľadať
            </button>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] text-gray-500 mr-0.5">Populárne:</span>
            <a href="#" className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full transition-colors">Bratislava</a>
            <a href="#" className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full transition-colors">Košice</a>
            <a href="#" className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full transition-colors">Žilina</a>
          </div>
          
          <button 
            type="button" 
            className="text-[10px] text-primary font-medium flex items-center"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Skryť' : 'Rozšírené'} vyhľadávanie
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-2.5 h-2.5 ml-0.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
        
        {/* Advanced search options */}
        {showAdvanced && (
          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Cenové rozpätie
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    name="minPrice"
                    value={priceRange[0]}
                    onChange={handlePriceChange}
                    placeholder="Od"
                    className="block w-full rounded-md border-gray-200 py-1.5 px-2 text-xs focus:border-primary focus:ring-primary"
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400 text-xs">
                    €
                  </div>
                </div>
                <span className="text-gray-400 text-xs">-</span>
                <div className="relative flex-1">
                  <input
                    type="number"
                    name="maxPrice"
                    value={priceRange[1]}
                    onChange={handlePriceChange}
                    placeholder="Do"
                    className="block w-full rounded-md border-gray-200 py-1.5 px-2 text-xs focus:border-primary focus:ring-primary"
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400 text-xs">
                    €
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="minSize" className="block text-xs font-medium text-gray-700 mb-1">
                Minimálna plocha (m²)
              </label>
              <input
                type="number"
                id="minSize"
                value={minSize}
                onChange={(e) => setMinSize(e.target.value)}
                placeholder="Minimálna plocha"
                className="block w-full rounded-md border-gray-200 py-1.5 px-2 text-xs focus:border-primary focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="bedrooms" className="block text-xs font-medium text-gray-700 mb-1">
                Počet izieb
              </label>
              <select
                id="bedrooms"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="block w-full rounded-md border-gray-200 py-1.5 px-2 text-xs focus:border-primary focus:ring-primary"
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

"use client";
import { useState } from 'react';

export default function SearchBar() {
  const [searchType, setSearchType] = useState('buy');
  const [propertyType, setPropertyType] = useState('all');
  const [location, setLocation] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would redirect to search results
    console.log('Search:', { searchType, propertyType, location });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 -mt-12 relative z-10 border border-gray-100">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Typ vyhľadávania</label>
            <div className="flex rounded-md overflow-hidden border border-gray-200">
              <button
                type="button"
                className={`flex-1 py-2 px-3 text-sm font-medium ${
                  searchType === 'buy' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setSearchType('buy')}
              >
                Kúpa
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-3 text-sm font-medium ${
                  searchType === 'rent' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setSearchType('rent')}
              >
                Prenájom
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
              Typ nehnuteľnosti
            </label>
            <select
              id="propertyType"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="block w-full rounded-md border-gray-200 py-2 px-3 text-sm focus:border-primary focus:ring-primary"
            >
              <option value="all">Všetky typy</option>
              <option value="apartment">Byty</option>
              <option value="house">Domy</option>
              <option value="land">Pozemky</option>
              <option value="commercial">Komerčné priestory</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Lokalita
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Mesto, okres alebo PSČ"
              className="block w-full rounded-md border-gray-200 py-2 px-3 text-sm focus:border-primary focus:ring-primary"
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-primary text-white rounded-md py-2 px-4 text-sm font-medium hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Vyhľadať
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 mr-2">Populárne:</span>
          <a href="#" className="text-xs text-gray-700 hover:text-primary">Bratislava</a>
          <a href="#" className="text-xs text-gray-700 hover:text-primary">Košice</a>
          <a href="#" className="text-xs text-gray-700 hover:text-primary">Žilina</a>
          <a href="#" className="text-xs text-gray-700 hover:text-primary">Banská Bystrica</a>
          <a href="#" className="text-xs text-gray-700 hover:text-primary">Nitra</a>
        </div>
      </form>
    </div>
  );
}

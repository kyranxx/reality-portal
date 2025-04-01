'use client';
import { useState, useEffect } from 'react';
import { featuredProperties } from '@/data/sampleProperties';
import Image from 'next/image';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(prev => (prev + 1) % featuredProperties.slice(0, 3).length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(prev => (prev === 0 ? featuredProperties.slice(0, 3).length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const slideProperties = featuredProperties.slice(0, 3);
  const currentProperty = slideProperties[currentSlide];

  return (
    <div className="relative h-[600px] overflow-hidden bg-gray-50 text-black">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/10 z-10"></div>

      {/* Carousel */}
      <div className="absolute inset-0 z-0">
        {slideProperties.map((property, index) => (
          <div
            key={property.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={property.imageUrl}
                alt={property.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover ${index === currentSlide ? 'scale-105' : 'scale-100'} transition-transform duration-10000`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="container relative z-20 h-full flex items-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-fadeIn">
            <h1 className="text-4xl md:text-6xl font-medium mb-4 text-white">
              Find your dream home
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl mx-auto">
              Largest selection of properties in Slovakia. Simple search, verified sellers, and complete services.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/nehnutelnosti"
                className="btn btn-primary px-8 py-4"
              >
                Browse properties
              </a>
              <a
                href="/pridat-nehnutelnost"
                className="btn bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30 px-8 py-4"
              >
                Add listing
              </a>
            </div>
          </div>

          {/* Search container - Grok style */}
          <div className="mt-16 search-container">
            <div className="bg-white/90 backdrop-blur-md rounded-lg p-5 shadow-lg">
              <div className="flex items-center border border-gray-200 rounded-full bg-white overflow-hidden px-5 py-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-400 mr-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search for properties..."
                  className="flex-1 outline-none border-0 focus:ring-0 py-2 text-black"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                <select className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm">
                  <option>All types</option>
                  <option>Apartments</option>
                  <option>Houses</option>
                  <option>Land</option>
                </select>
                <select className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm">
                  <option>Price range</option>
                  <option>Under 100,000€</option>
                  <option>100,000€ - 200,000€</option>
                  <option>Over 200,000€</option>
                </select>
                <select className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm">
                  <option>All locations</option>
                  <option>Bratislava</option>
                  <option>Košice</option>
                  <option>Žilina</option>
                </select>
                <button className="bg-black text-white rounded-lg p-3 text-sm font-medium">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel controls - minimal */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slideProperties.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentSlide ? 'bg-white scale-100' : 'bg-white/50 scale-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/30 text-white p-2.5 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/30 text-white p-2.5 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}

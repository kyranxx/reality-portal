"use client";
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
    }, 6000);
    
    return () => clearInterval(interval);
  }, [currentSlide]);
  
  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % featuredProperties.slice(0, 3).length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };
  
  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === 0 ? featuredProperties.slice(0, 3).length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  };
  
  const slideProperties = featuredProperties.slice(0, 3);
  const currentProperty = slideProperties[currentSlide];
  
  return (
    <div className="relative h-[500px] overflow-hidden bg-gradient-to-r from-primary to-secondary text-white">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Carousel */}
      <div className="absolute inset-0 z-0">
        {slideProperties.map((property, index) => (
          <div 
            key={property.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-cover bg-center" style={{
              backgroundImage: `url('${property.imageUrl}')`,
              backgroundSize: 'cover',
              transform: 'scale(1.05)',
              transition: 'transform 6s ease-in-out',
              animation: index === currentSlide ? 'slowZoom 6s ease-in-out' : 'none'
            }}></div>
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className="container relative z-20 h-full flex items-center">
        <div className="max-w-2xl">
          <div className="animate-fadeIn">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-3 animate-slideInRight">
              Objavte dokonalý domov
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 animate-slideInUp">
              Nájdite si svoj <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-amber-200">vysnívaný domov</span>
            </h1>
            <p className="text-base md:text-lg opacity-90 mb-6 animate-slideInUp animation-delay-100">
              Najväčšia ponuka nehnuteľností na Slovensku. Jednoduché vyhľadávanie, overení predajcovia a kompletný servis.
            </p>
            <div className="flex flex-wrap gap-3 animate-slideInUp animation-delay-200">
              <a href="/nehnutelnosti" className="btn bg-white text-primary hover:bg-gray-100 shadow-md hover:shadow-lg transition-all">
                Prehliadať nehnuteľnosti
              </a>
              <a href="/pridat-nehnutelnost" className="btn bg-transparent border border-white text-white hover:bg-white/20 transition-all">
                Pridať inzerát
              </a>
            </div>
          </div>
          
          {/* Property highlight */}
          <div className="mt-8 bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/10 animate-slideInUp animation-delay-300 hidden md:block">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-md overflow-hidden relative flex-shrink-0">
                <Image 
                  src={currentProperty.imageUrl} 
                  alt={currentProperty.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="ml-3">
                <span className="text-amber-300 text-xs font-medium">Odporúčaná nehnuteľnosť</span>
                <h3 className="font-semibold text-sm">{currentProperty.title}</h3>
                <p className="text-xs text-white/80">{currentProperty.location} • {currentProperty.price.toLocaleString()} €</p>
              </div>
              <a href={`/nehnutelnosti/${currentProperty.id}`} className="ml-auto bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Carousel controls */}
      <div className="absolute bottom-6 right-6 z-20 flex space-x-1.5">
        {slideProperties.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white scale-100' : 'bg-white/50 scale-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}

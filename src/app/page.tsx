import HeroSection from '@/components/HeroSection';
import SearchBar from '@/components/SearchBar';
import SectionTitle from '@/components/SectionTitle';
import PropertyCard from '@/components/PropertyCard';
import CategoryCard from '@/components/CategoryCard';
import { featuredProperties, newProperties } from '@/data/sampleProperties';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Search Bar */}
      <div className="container">
        <SearchBar />
      </div>
      
      {/* Stats Section */}
      <section className="py-10">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            <div className="animate-slideInUp">
              <div className="text-3xl md:text-4xl font-bold text-primary">15,000+</div>
              <div className="text-gray-600 mt-1">Nehnuteľností</div>
            </div>
            <div className="animate-slideInUp animation-delay-100">
              <div className="text-3xl md:text-4xl font-bold text-primary">8,500+</div>
              <div className="text-gray-600 mt-1">Spokojných klientov</div>
            </div>
            <div className="animate-slideInUp animation-delay-200">
              <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
              <div className="text-gray-600 mt-1">Overených predajcov</div>
            </div>
            <div className="animate-slideInUp animation-delay-300">
              <div className="text-3xl md:text-4xl font-bold text-primary">98%</div>
              <div className="text-gray-600 mt-1">Spokojnosť</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Property Categories */}
      <section className="py-16">
        <div className="container">
          <SectionTitle 
            title="Prehliadajte podľa kategórie" 
            subtitle="Nájdite nehnuteľnosť podľa vašich predstáv"
            centered
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CategoryCard 
              title="Byty"
              description="Nájdite si byt v meste alebo na predmestí"
              href="/nehnutelnosti/byty"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              }
            />
            
            <CategoryCard 
              title="Domy"
              description="Rodinné domy a vily pre pohodlné bývanie"
              href="/nehnutelnosti/domy"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              }
            />
            
            <CategoryCard 
              title="Pozemky"
              description="Stavebné a investičné pozemky"
              href="/nehnutelnosti/pozemky"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
              }
            />
            
            <CategoryCard 
              title="Komerčné"
              description="Kancelárie, obchody a priemyselné priestory"
              href="/nehnutelnosti/komercne"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>
      
      {/* Featured Property of the Week */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <div className="lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src={featuredProperties[0].imageUrl}
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
              <h2 className="text-3xl font-bold mt-3 mb-4">{featuredProperties[0].title}</h2>
              <p className="text-gray-600 mb-6">
                Luxusná nehnuteľnosť v prestížnej lokalite s výbornou dostupnosťou do centra mesta. 
                Táto nehnuteľnosť ponúka moderné vybavenie, priestranné izby a krásny výhľad na okolie.
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
                    <div className="font-medium">{featuredProperties[0].location}</div>
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
                    <div className="font-medium">{featuredProperties[0].price.toLocaleString()} €</div>
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
                    <div className="font-medium">{featuredProperties[0].size} m²</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Izby</div>
                    <div className="font-medium">{featuredProperties[0].bedrooms} izby</div>
                  </div>
                </div>
              </div>
              
              <Link href={`/nehnutelnosti/${featuredProperties[0].id}`} className="btn btn-primary shadow-lg hover:shadow-xl">
                Zobraziť detail
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Properties */}
      <section className="py-16">
        <div className="container">
          <SectionTitle 
            title="Odporúčané nehnuteľnosti" 
            subtitle="Pozrite si naše najlepšie ponuky"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.slice(1, 7).map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/nehnutelnosti" className="btn btn-primary shadow-md hover:shadow-lg">
              Zobraziť všetky nehnuteľnosti
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="bg-primary rounded-lg p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Máte nehnuteľnosť na predaj?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Pridajte svoj inzerát na Reality Portal a oslovte tisíce potenciálnych záujemcov.
            </p>
            <Link href="/pridat-nehnutelnost" className="btn bg-white text-primary hover:bg-gray-100">
              Pridať inzerát
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-primary to-secondary text-white">
      <div className="absolute inset-0 bg-black/30 z-0"></div>
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1773&q=80')",
          backgroundBlendMode: "overlay"
        }}
      ></div>
      
      <div className="container relative z-10 py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nájdite si svoj vysnívaný domov
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Najväčšia ponuka nehnuteľností na Slovensku. Jednoduché vyhľadávanie, overení predajcovia a kompletný servis.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/nehnutelnosti" className="btn bg-white text-primary hover:bg-gray-100">
              Prehliadať nehnuteľnosti
            </a>
            <a href="/pridat-nehnutelnost" className="btn bg-transparent border border-white text-white hover:bg-white/10">
              Pridať inzerát
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

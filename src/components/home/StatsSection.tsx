'use client';

const StatsSection = () => {
  return (
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
  );
};

export default StatsSection;

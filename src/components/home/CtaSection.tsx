'use client';

import Link from 'next/link';

const CtaSection = () => {
  return (
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
  );
};

export default CtaSection;

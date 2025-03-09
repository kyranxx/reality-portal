export default function ONasPage() {
  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold mb-8">O nás</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Váš spoľahlivý partner pri hľadaní nehnuteľností</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Reality Portal je moderný realitný portál, ktorý spája predávajúcich a kupujúcich na slovenskom realitnom trhu. 
              Naším cieľom je poskytnúť jednoduchý a prehľadný spôsob, ako nájsť vysnívanú nehnuteľnosť alebo rýchlo a efektívne predať tú vašu.
            </p>
            <p>
              Od nášho založenia v roku 2020 sme pomohli tisícom ľudí nájsť nový domov a stovkám predajcov úspešne predať svoje nehnuteľnosti. 
              Neustále pracujeme na vylepšovaní našich služieb a prinášaní nových funkcií, ktoré uľahčia celý proces.
            </p>
            <p>
              Veríme, že každý si zaslúži kvalitné bývanie a náš tím skúsených odborníkov je tu, aby vám pomohol tento cieľ dosiahnuť.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-8">
          <h3 className="text-xl font-semibold mb-4">Prečo si vybrať Reality Portal?</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Najväčšia ponuka nehnuteľností na Slovensku</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Overení predajcovia a kvalitné inzeráty</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Pokročilé vyhľadávanie a filtrovanie</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Pravidelné aktualizácie a notifikácie</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Bezpečná komunikácia medzi kupujúcim a predávajúcim</span>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Profesionálne poradenstvo a podpora</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">Náš tím</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Michal Novák",
              position: "CEO & Zakladateľ",
              bio: "Michal má viac ako 15 rokov skúseností v realitnom sektore a je hlavným vizionárom Reality Portalu."
            },
            {
              name: "Jana Kováčová",
              position: "Vedúca oddelenia predaja",
              bio: "Jana sa špecializuje na luxusné nehnuteľnosti a má bohaté skúsenosti s predajom v Bratislave a okolí."
            },
            {
              name: "Peter Horváth",
              position: "Hlavný technologický riaditeľ",
              bio: "Peter vedie náš technologický tím a zabezpečuje, aby naša platforma bola vždy na špičkovej úrovni."
            },
            {
              name: "Zuzana Malá",
              position: "Vedúca zákazníckeho servisu",
              bio: "Zuzana a jej tím sú tu, aby vám pomohli s akýmikoľvek otázkami a problémami."
            }
          ].map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-primary text-sm mb-2">{member.position}</p>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-center">Naše hodnoty</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-primary/5 rounded-lg p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Dôveryhodnosť</h3>
            <p className="text-gray-700">
              Budujeme dlhodobé vzťahy založené na dôvere a transparentnosti. Všetky naše inzeráty prechádzajú dôkladnou kontrolou.
            </p>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Inovácia</h3>
            <p className="text-gray-700">
              Neustále hľadáme nové spôsoby, ako zlepšiť používateľský zážitok a prinášať inovatívne riešenia na realitný trh.
            </p>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Spokojnosť klientov</h3>
            <p className="text-gray-700">
              Naším hlavným cieľom je spokojnosť našich klientov. Robíme všetko pre to, aby sme prekročili vaše očakávania.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

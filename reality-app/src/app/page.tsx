export default function Home() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Reality Portal</h1>
      <p className="mb-4">Vitajte na našom realitnom portáli!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Sample property listings */}
        <div className="border rounded-lg overflow-hidden shadow-md">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <h2 className="text-xl font-semibold">3-izbový byt, Bratislava</h2>
            <p className="text-gray-600">Staré Mesto, 75m²</p>
            <p className="font-bold text-lg mt-2">185 000 €</p>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden shadow-md">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <h2 className="text-xl font-semibold">Rodinný dom, Košice</h2>
            <p className="text-gray-600">Sever, 120m², pozemok 450m²</p>
            <p className="font-bold text-lg mt-2">245 000 €</p>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden shadow-md">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <h2 className="text-xl font-semibold">2-izbový byt, Žilina</h2>
            <p className="text-gray-600">Centrum, 55m²</p>
            <p className="font-bold text-lg mt-2">125 000 €</p>
          </div>
        </div>
      </div>
    </div>
  );
}

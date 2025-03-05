export default function Home() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Reality Portal</h1>
      <p className="mb-4">Vitajte na na┼íom realitnom port├íli!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Sample property listings */}
        <div className="border rounded-lg overflow-hidden shadow-md">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <h2 className="text-xl font-semibold">3-izbov├Ż byt, Bratislava</h2>
            <p className="text-gray-600">Star├ę Mesto, 75m┬▓</p>
            <p className="font-bold text-lg mt-2">185 000 ÔéČ</p>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden shadow-md">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <h2 className="text-xl font-semibold">Rodinn├Ż dom, Ko┼íice</h2>
            <p className="text-gray-600">Sever, 120m┬▓, pozemok 450m┬▓</p>
            <p className="font-bold text-lg mt-2">245 000 ÔéČ</p>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden shadow-md">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <h2 className="text-xl font-semibold">2-izbov├Ż byt, ┼Żilina</h2>
            <p className="text-gray-600">Centrum, 55m┬▓</p>
            <p className="font-bold text-lg mt-2">125 000 ÔéČ</p>
          </div>
        </div>
      </div>
    </div>
  );
}

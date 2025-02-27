export default function Header() {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Reality Portal</h1>
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            <li><a href="/" className="hover:underline">Domov</a></li>
            <li><a href="/nehnutelnosti" className="hover:underline">Nehnuteľnosti</a></li>
            <li><a href="/o-nas" className="hover:underline">O nás</a></li>
            <li><a href="/kontakt" className="hover:underline">Kontakt</a></li>
          </ul>
        </nav>
        
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-white text-primary rounded hover:bg-gray-100">
            Prihlásiť sa
          </button>
        </div>
      </div>
    </header>
  );
}

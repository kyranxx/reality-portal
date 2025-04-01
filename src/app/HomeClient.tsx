'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';

export default function HomeClient() {
  const [loading, setLoading] = useState(false);

  // Shows Grok-inspired search interface
  return (
    <main className="min-h-screen bg-white">
      {/* SearchBar now has its own container inside */}
      <SearchBar />
    </main>
  );
}

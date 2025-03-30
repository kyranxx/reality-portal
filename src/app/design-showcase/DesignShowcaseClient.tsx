"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import './design-showcase.css';

export default function DesignShowcaseClient() {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would handle form submission in a real implementation
    console.log('Submitted prompt:', prompt);
  };

  return (
    <div className="min-h-screen flex flex-col w-full max-w-5xl mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div className="text-2xl font-bold">Design Showcase</div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
            {/* Placeholder for user avatar */}
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        <div className="flex-grow flex flex-col items-center justify-center mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Design Showcase</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Modern interface design example
            </p>
          </div>
          
          <div className="w-full max-w-xl">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Search designs..."
                className="showcase-input w-full p-4 pr-12 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="showcase-button absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
        </div>

        <div className="showcase-features flex justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Clean design</span>
          <span>•</span>
          <span>Dark mode</span>
          <span>•</span>
          <span>Responsive layout</span>
        </div>
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>© 2025 Reality Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}

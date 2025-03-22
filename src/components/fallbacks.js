/**
 * Fallback components for Vercel deployment
 * 
 * This file provides simple fallback implementations for components
 * that might fail to import during the build process on Vercel.
 */

import React from 'react';

// Fallback SectionTitle component
export const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
      {subtitle && <p className="text-gray-500">{subtitle}</p>}
    </div>
  );
};

// Add other fallback components as needed

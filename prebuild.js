// Enhanced prebuild script for Vercel deployment
const fs = require('fs');
const path = require('path');

console.log('Running enhanced prebuild script...');

// Set a special flag to indicate we're in build mode
// This will be used to skip authentication checks during build
process.env.NEXT_PUBLIC_IS_BUILD_TIME = 'true';

// Determine if we're in Vercel environment
const isVercel = process.env.VERCEL === '1';
console.log(`Build environment: ${isVercel ? 'Vercel' : 'Local'}`);

// Create helper function for environment variable processing
const processEnvVars = () => {
  // Verify and normalize Firebase config variables
  const firebaseVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
  ];

  // Check each Firebase variable and set placeholder if needed
  firebaseVars.forEach(varName => {
    if (!process.env[varName] || process.env[varName].includes('${') || process.env[varName] === varName) {
      const placeholderValue = `placeholder-${varName.replace('NEXT_PUBLIC_FIREBASE_', '').toLowerCase()}`;
      console.log(`Setting placeholder for ${varName}: ${placeholderValue}`);
      process.env[varName] = placeholderValue;
    }
  });

  // Verify and normalize Supabase config variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('${') || 
      process.env.NEXT_PUBLIC_SUPABASE_URL === 'NEXT_PUBLIC_SUPABASE_URL') {
    console.log('Setting placeholder Supabase URL');
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder-url.supabase.co';
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('${') || 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
    console.log('Setting placeholder Supabase anon key');
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'placeholder-key';
  }
};

// Process environment variables
processEnvVars();

// Create a .env.local file to ensure environment variables are available during build
try {
  console.log('Creating .env.local file with normalized values...');
  let envContent = '';
  
  // Add Firebase config with normalized values
  envContent += `NEXT_PUBLIC_FIREBASE_API_KEY=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_PROJECT_ID=${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_APP_ID=${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}\n`;
  
  // Add Supabase config with normalized values
  envContent += `NEXT_PUBLIC_SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`;
  envContent += `NEXT_PUBLIC_SUPABASE_ANON_KEY=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}\n`;
  
  // Add build-time flag and other useful environment variables
  envContent += `NEXT_PUBLIC_IS_BUILD_TIME=true\n`;
  envContent += `NEXT_PUBLIC_VERCEL_ENV=${process.env.VERCEL_ENV || 'development'}\n`;
  
  fs.writeFileSync('.env.local', envContent);
  console.log('.env.local file created successfully.');
} catch (error) {
  console.error('Error creating .env.local file:', error);
}

// Create fallback modules for common import errors during build
const createFallbackFiles = () => {
  console.log('Setting up fallback modules for build...');
  
  try {
    // Ensure path exists for any component fallbacks we want to create
    const componentsDir = path.join(__dirname, 'src', 'components');
    if (!fs.existsSync(componentsDir)) {
      fs.mkdirSync(componentsDir, { recursive: true });
    }
    
    // Create SectionTitle.js fallback if it doesn't exist
    const sectionTitlePath = path.join(componentsDir, 'SectionTitle.js');
    if (!fs.existsSync(sectionTitlePath)) {
      const fallbackComponent = `
import React from 'react';

// Fallback SectionTitle component for Vercel build
export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
      {subtitle && <p className="text-gray-500">{subtitle}</p>}
    </div>
  );
}
      `.trim();
      
      fs.writeFileSync(sectionTitlePath, fallbackComponent);
      console.log('Created fallback SectionTitle component');
    }
  } catch (error) {
    console.error('Error creating fallback files:', error);
  }
};

// Create fallback modules if needed
if (isVercel) {
  createFallbackFiles();
}

console.log('Enhanced prebuild script completed successfully.');

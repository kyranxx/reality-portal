// This script runs before the build to ensure proper environment setup
console.log('Running prebuild script...');

// Set placeholder values for Firebase config if not provided
// This ensures the build process can complete even without real values
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.log('Setting placeholder Firebase config for build...');
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'placeholder-api-key';
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'placeholder-auth-domain';
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'placeholder-project-id';
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'placeholder-storage-bucket';
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'placeholder-messaging-sender-id';
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID = 'placeholder-app-id';
  process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = 'placeholder-measurement-id';
}

// Set placeholder values for Supabase config if not provided
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('Setting placeholder Supabase config for build...');
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder-url.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'placeholder-key';
}

// Create a .env.local file to ensure environment variables are available during build
const fs = require('fs');
try {
  console.log('Creating .env.local file...');
  let envContent = '';
  
  // Add Firebase config
  envContent += `NEXT_PUBLIC_FIREBASE_API_KEY=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'placeholder-api-key'}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'placeholder-auth-domain'}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_PROJECT_ID=${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'placeholder-project-id'}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'placeholder-storage-bucket'}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'placeholder-messaging-sender-id'}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_APP_ID=${process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'placeholder-app-id'}\n`;
  envContent += `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'placeholder-measurement-id'}\n`;
  
  // Add Supabase config
  envContent += `NEXT_PUBLIC_SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co'}\n`;
  envContent += `NEXT_PUBLIC_SUPABASE_ANON_KEY=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'}\n`;
  
  fs.writeFileSync('.env.local', envContent);
  console.log('.env.local file created successfully.');
} catch (error) {
  console.error('Error creating .env.local file:', error);
}

console.log('Prebuild script completed successfully.');

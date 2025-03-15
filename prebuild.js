// This script runs before the build to ensure proper environment setup
console.log('Running prebuild script...');

// Force dynamic rendering for authentication-dependent pages
process.env.NEXT_RUNTIME = 'edge';
process.env.NEXT_FORCE_DYNAMIC = 'true';

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

console.log('Prebuild script completed successfully.');

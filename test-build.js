#!/usr/bin/env node

/**
 * Test script to validate the universal client component architecture
 * This simulates the Vercel build process locally to ensure our architecture works
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running architecture validation build test...');

// Set environment variables to simulate Vercel
process.env.VERCEL = '1';
process.env.VERCEL_ENV = 'production';
process.env.NEXT_PUBLIC_IS_VERCEL = 'true';
process.env.NODE_ENV = 'production';

// Validate the architecture first
try {
  console.log('Validating client component architecture...');
  
  // Check that _components.tsx and _client-loader.tsx exist
  const requiredFiles = [
    './src/app/_components.tsx',
    './src/app/_client-loader.tsx',
  ];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      throw new Error(`Required file not found: ${file}`);
    }
    console.log(`✓ Found ${file}`);
  });
  
  // Run the pre-build validation
  console.log('\nRunning pre-build validation...');
  execSync('node scripts/pre-build-validation.js', { stdio: 'inherit' });
} catch (error) {
  console.error('\n❌ Architecture validation failed:', error.message);
  process.exit(1);
}

// Create a test build with just the essential files
console.log('\nPreparing test build environment...');

try {
  // Create a temporary .env.local file if it doesn't exist
  if (!fs.existsSync('.env.local')) {
    console.log('Creating temporary .env.local file...');
    fs.writeFileSync('.env.local', '# Temporary .env.local for testing\n');
  }
  
  // Run a partial Next.js build
  console.log('\nRunning partial Next.js build to test component resolution...');
  execSync('next build --no-lint', { stdio: 'inherit' });
  
  console.log('\n✅ Test build successful! The universal client component architecture is working correctly.');
} catch (error) {
  console.error('\n❌ Test build failed:', error.message);
  
  if (error.message.includes('Element type is invalid')) {
    console.error('\nThis error indicates a component resolution problem in the build environment.');
    console.error('Common causes:');
    console.error('1. Path aliases not being resolved correctly');
    console.error('2. Client components not properly registered');
    console.error('3. Dynamic imports with string templates');
  }
  
  process.exit(1);
}

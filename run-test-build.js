#!/usr/bin/env node

/**
 * Test build script to verify Vercel deployment fixes
 * 
 * This script runs a build with the fixes applied for the "self is not defined" error
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('Running test build with fixes applied...');

// Make sure the self polyfill is available globally in Node.js
if (typeof global.self === 'undefined') {
  console.log('Setting up browser globals polyfill for server environment...');
  global.self = global;
}

try {
  // Clean previous build artifacts to ensure clean test
  console.log('Cleaning previous build artifacts...');
  if (fs.existsSync('./.next')) {
    // Use fs.rmSync for Node.js (cross-platform) or fallback to platform-specific commands
    try {
      console.log('Removing .next directory...');
      if (fs.rmSync) {
        // Node.js 14.14.0+ has rmSync
        fs.rmSync('./.next', { recursive: true, force: true });
      } else {
        // Fallback to platform-specific command
        const isWindows = process.platform === 'win32';
        if (isWindows) {
          execSync('rmdir /s /q .next', { stdio: 'inherit' });
        } else {
          execSync('rm -rf ./.next', { stdio: 'inherit' });
        }
      }
    } catch (e) {
      console.warn('Warning: Failed to clean .next directory:', e.message);
      console.warn('Continuing with build anyway...');
    }
  }
  
  // Run the build with our fixes using the same command as Vercel
  console.log('Starting test build using the Vercel build command...');
  execSync('npm run build:vercel', { stdio: 'inherit' });
  
  console.log('\n✅ TEST BUILD SUCCEEDED!');
  console.log('The fixes for "self is not defined" error appear to be working.');
  console.log('You should now be able to deploy to Vercel without errors.');
  
} catch (error) {
  console.error('\n❌ TEST BUILD FAILED!');
  console.error('Error:', error.message);
  console.error('\nTry running the diagnostic script for more details:');
  console.error('node scripts/diagnose-build-errors.js --run-build');
}

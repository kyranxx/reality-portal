#!/usr/bin/env node

/**
 * Verify Browser Globals Polyfill Fixes
 *
 * This script checks if all the browser globals polyfills are properly applied
 * and functioning in the server environment.
 */

// Import the browser polyfills
require('./src/utils/browser-polyfills');

console.log('Verifying browser globals polyfill fixes...');

// Create a table of browser globals to check
const browserGlobals = [
  { name: 'self', expected: 'object' },
  { name: 'window', expected: 'object' },
  { name: 'document', expected: 'object' },
  { name: 'navigator', expected: 'object' },
  { name: 'localStorage', expected: 'object' },
  { name: 'sessionStorage', expected: 'object' },
  { name: 'fetch', expected: 'function' },
  { name: 'requestAnimationFrame', expected: 'function' },
];

// Check each global
console.log('\nChecking browser globals in Node.js environment:');
console.log('┌─────────────────────┬────────┬──────────┐');
console.log('│ Browser Global       │ Status │ Type     │');
console.log('├─────────────────────┼────────┼──────────┤');

let allPassed = true;

browserGlobals.forEach(({ name, expected }) => {
  const value = global[name];
  const exists = typeof value !== 'undefined';
  const type = exists ? typeof value : 'undefined';
  const pass = exists && type === expected;

  if (!pass) allPassed = false;

  console.log(`│ ${name.padEnd(19)} │ ${pass ? '✓ PASS ' : '✗ FAIL '} │ ${type.padEnd(8)} │`);
});

console.log('└─────────────────────┴────────┴──────────┘');

// Test accessing common browser APIs that might cause errors
console.log('\nTesting common browser API access patterns:');

const tests = [
  {
    name: 'self reference',
    code: () => {
      const x = self;
      return true;
    },
  },
  {
    name: 'window.location',
    code: () => {
      const loc = window.location;
      return true;
    },
  },
  {
    name: 'document.createElement',
    code: () => {
      const div = document.createElement('div');
      return true;
    },
  },
  {
    name: 'localStorage.getItem',
    code: () => {
      localStorage.getItem('test');
      return true;
    },
  },
  {
    name: 'fetch API',
    code: () => {
      typeof fetch === 'function';
      return true;
    },
  },
];

tests.forEach(({ name, code }) => {
  try {
    const result = code();
    console.log(`✓ ${name}: OK`);
  } catch (error) {
    allPassed = false;
    console.log(`✗ ${name}: FAILED - ${error.message}`);
  }
});

// Summary
console.log('\nVerification Summary:');
if (allPassed) {
  console.log('✅ All browser globals polyfills are working correctly!');
  console.log(
    '   Your Vercel deployment should no longer encounter the "self is not defined" error.'
  );
} else {
  console.log('❌ Some polyfills are not functioning correctly.');
  console.log('   Review the output above and update browser-polyfills.js as needed.');
}

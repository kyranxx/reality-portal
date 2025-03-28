#!/usr/bin/env node

/**
 * Build Error Diagnostic Tool
 *
 * This script helps identify the source of "self is not defined" and other
 * browser-specific reference errors during server-side rendering.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting build error diagnostics...');

// Apply global object polyfills for server environment
console.log('Setting up diagnostic environment...');

// Create a global self object to catch references
global.self = global;

// Track which modules access 'self'
const selfAccessTracker = new Set();
const originalRequire = module.require;

// Flag to enable/disable module access tracking (may slow down build)
const ENABLE_MODULE_TRACKING = false;

if (ENABLE_MODULE_TRACKING) {
  // Override require to track modules that access self
  module.require = function (id) {
    const result = originalRequire.apply(this, arguments);
    const callerFile = new Error().stack.split('\n')[2].match(/\(([^:]+):/)?.[1];

    // Use a Proxy to detect 'self' access
    if (result && typeof result === 'object') {
      return new Proxy(result, {
        get(target, prop) {
          if (prop === 'self' && callerFile) {
            selfAccessTracker.add(callerFile);
            console.log(`Module accessing 'self': ${callerFile}`);
          }
          return target[prop];
        },
      });
    }

    return result;
  };
}

// Create a diagnostic build directory
const diagnosticDir = path.join(process.cwd(), '.diagnostic');
if (!fs.existsSync(diagnosticDir)) {
  fs.mkdirSync(diagnosticDir);
}

// Function to analyze vendor chunks
function analyzeVendorChunks() {
  console.log('Analyzing vendor chunks for browser-specific code...');

  // Look for the compiled vendor chunk files
  const nextDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(nextDir)) {
    console.log('No .next directory found. Run a build first.');
    return;
  }

  const serverDir = path.join(nextDir, 'server');
  if (!fs.existsSync(serverDir)) {
    console.log('No server directory found in .next.');
    return;
  }

  // Look for vendor chunks
  const vendorFiles = fs
    .readdirSync(serverDir)
    .filter(file => file.includes('vendor') && file.endsWith('.js'));

  if (vendorFiles.length === 0) {
    console.log('No vendor chunks found.');
    return;
  }

  // Check each vendor file for browser-specific globals
  vendorFiles.forEach(file => {
    const filePath = path.join(serverDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for browser globals
    const browserGlobals = [
      { name: 'self', regex: /\bself\b(?!\s*=)/g },
      { name: 'window', regex: /\bwindow\b(?!\s*=)/g },
      { name: 'document', regex: /\bdocument\b(?!\s*=)/g },
      { name: 'navigator', regex: /\bnavigator\b(?!\s*=)/g },
      { name: 'localStorage', regex: /\blocalStorage\b(?!\s*=)/g },
    ];

    console.log(`\nAnalyzing ${file}:`);
    let suspiciousCode = false;

    browserGlobals.forEach(global => {
      const matches = content.match(global.regex);
      if (matches && matches.length > 0) {
        console.log(`  - Found ${matches.length} references to '${global.name}'`);
        suspiciousCode = true;

        // Find some context for the first few occurrences
        let count = 0;
        let lastIndex = 0;

        while ((lastIndex = content.indexOf(global.name, lastIndex)) !== -1 && count < 3) {
          const start = Math.max(0, lastIndex - 40);
          const end = Math.min(content.length, lastIndex + 40);
          const snippet = content.substring(start, end);

          console.log(`    Context: ...${snippet}...`);

          lastIndex += global.name.length;
          count++;
        }
      }
    });

    if (!suspiciousCode) {
      console.log('  - No browser-specific globals found');
    }
  });
}

// Function to run a diagnostic build
function runDiagnosticBuild() {
  console.log('Running diagnostic build with enhanced error handling...');

  try {
    // Add a diagnostic script to catch runtime errors
    const interceptorPath = path.join(diagnosticDir, 'self-interceptor.js');
    fs.writeFileSync(
      interceptorPath,
      `
      // Install global.self before any other code runs
      if (typeof global.self === 'undefined') {
        console.log('[Diagnostic] Installing global.self polyfill');
        global.self = global;
      }
      
      // Track which file tried to access self
      const originalPrepareStackTrace = Error.prepareStackTrace;
      Error.prepareStackTrace = function(error, stack) {
        if (error.message && error.message.includes('self is not defined')) {
          console.error('[Diagnostic] Self reference error detected:');
          console.error('  Location:', stack[0].getFileName(), 'line:', stack[0].getLineNumber());
        }
        return originalPrepareStackTrace(error, stack);
      };
      
      // Continue with normal module loading
      process.on('uncaughtException', (error) => {
        if (error.message && error.message.includes('self is not defined')) {
          console.error('[Diagnostic] Uncaught self reference:', error.message);
          // Instead of crashing, just log it and continue
          return;
        }
        throw error;
      });
    `
    );

    // Run build with the interceptor
    const cmd = `node -r ${interceptorPath} node_modules/.bin/next build --no-lint`;
    execSync(cmd, { stdio: 'inherit' });
    console.log('Diagnostic build completed successfully.');
  } catch (error) {
    console.log('Diagnostic build failed, but we caught useful information.');
  }
}

// Run the diagnostics
console.log('\n=== MODULE ANALYSIS ===');
analyzeVendorChunks();

console.log('\n=== BUILD DIAGNOSTICS ===');
if (process.argv.includes('--run-build')) {
  runDiagnosticBuild();
} else {
  console.log('Skipping diagnostic build. Run with --run-build to execute a diagnostic build.');
}

// Report any modules that accessed 'self'
if (ENABLE_MODULE_TRACKING && selfAccessTracker.size > 0) {
  console.log('\nModules accessing self:');
  Array.from(selfAccessTracker).forEach(mod => console.log(` - ${mod}`));
}

console.log('\nDiagnostics complete. Check the output above for details on any issues found.');

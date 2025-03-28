#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 *
 * Validates that all required environment variables are set before starting the app.
 * Add this to your package.json scripts:
 * "predev": "node scripts/validate-environment.js",
 * "prebuild": "node scripts/validate-environment.js"
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// ANSI colors for terminal output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

console.log('Validating environment variables...');

// Load environment variables from .env files
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// Define required variables
const REQUIRED_VARIABLES = [
  {
    name: 'NEXT_PUBLIC_FIREBASE_API_KEY',
    description: 'Firebase API key',
    example: 'AIzaSyC_example123456789',
    criticalForProduction: true,
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    description: 'Firebase auth domain',
    example: 'your-project-id.firebaseapp.com',
    criticalForProduction: true,
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    description: 'Firebase project ID',
    example: 'your-project-id',
    criticalForProduction: true,
  },
];

// Check if we're in a production environment
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';
const isCICD = process.env.CI === 'true';

// Track missing variables
const missingVariables = [];
const warningVariables = [];

// Check each required variable
REQUIRED_VARIABLES.forEach(variable => {
  const value = process.env[variable.name];

  if (!value || value.includes('your-') || value.includes('undefined')) {
    // In production, all critical variables must be set
    if (isProduction && variable.criticalForProduction) {
      missingVariables.push(variable);
    } else {
      // In development, show warnings but don't fail
      warningVariables.push(variable);
    }
  }
});

// Check if .env.local exists
if (!fs.existsSync(path.join(process.cwd(), '.env.local'))) {
  console.warn(`${YELLOW}Warning: .env.local file not found.${RESET}`);
  console.warn(
    `${YELLOW}You should create a .env.local file based on .env.example with your Firebase configuration.${RESET}`
  );
}

// Display results
if (missingVariables.length > 0 || warningVariables.length > 0) {
  if (missingVariables.length > 0) {
    console.error(`${RED}Missing required environment variables:${RESET}`);
    missingVariables.forEach(variable => {
      console.error(`${RED}- ${variable.name}: ${variable.description}${RESET}`);
      console.error(`  Example: ${variable.example}`);
    });
  }

  if (warningVariables.length > 0) {
    console.warn(
      `${YELLOW}Warning: The following environment variables are not set or have placeholder values:${RESET}`
    );
    warningVariables.forEach(variable => {
      console.warn(`${YELLOW}- ${variable.name}: ${variable.description}${RESET}`);
      console.warn(`  Example: ${variable.example}`);
    });
  }

  // Show help message
  console.log('\nTo fix these issues:');
  console.log('1. Copy .env.example to .env.local');
  console.log('2. Edit .env.local and add your Firebase configuration values');
  console.log('3. Restart the application');

  // In production, fail the build if critical variables are missing
  if (isProduction && missingVariables.length > 0 && !isCICD) {
    console.error(
      `${RED}Error: Cannot start production build with missing environment variables.${RESET}`
    );
    process.exit(1);
  }
} else {
  console.log(`${GREEN}✓ All required environment variables are set.${RESET}`);
}

// Special case for navigation timeout
if (process.env.PUPPETEER_NAVIGATION_TIMEOUT) {
  console.log(`Navigation timeout is set to ${process.env.PUPPETEER_NAVIGATION_TIMEOUT}ms`);
} else {
  console.log(
    `${YELLOW}Note: You can set PUPPETEER_NAVIGATION_TIMEOUT to a higher value if you experience timeouts.${RESET}`
  );
}

// Additional check for local development
if (!isProduction && !isVercel) {
  // Recommend adding Firebase emulator configuration if not set
  if (!process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS) {
    console.log(
      `${YELLOW}Tip: For local development, you can set NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true in .env.local to use Firebase emulators.${RESET}`
    );
  }
}

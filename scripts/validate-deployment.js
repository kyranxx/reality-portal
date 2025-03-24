#!/usr/bin/env node

/**
 * Pre-deployment validation script
 * 
 * This script verifies that all required configuration is in place before deployment.
 * It checks for environment variables, Firebase configuration, and verifies app health.
 * 
 * Run this script before deployment with: node scripts/validate-deployment.js
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { execSync } = require('child_process');
const chalk = require('chalk');

// Load environment variables
try {
  dotenv.config({ path: '.env.local' });
  dotenv.config({ path: '.env' });
} catch (error) {
  console.error('Error loading .env files:', error);
}

// Environment variables to check
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

// Paths to check
const REQUIRED_FILES = [
  'src/utils/firebase.ts',
  'src/utils/firebase-auth-unified.ts',
  'src/utils/FirebaseAuthContext.tsx',
  'src/components/AuthErrorBoundary.tsx',
  'next.config.js',
];

// Helper functions
const log = {
  info: (msg) => console.log(chalk.blue('ℹ ') + msg),
  success: (msg) => console.log(chalk.green('✅ ') + msg),
  warning: (msg) => console.log(chalk.yellow('⚠️ ') + msg),
  error: (msg) => console.log(chalk.red('❌ ') + msg),
  title: (msg) => console.log('\n' + chalk.bold.underline(msg)),
};

// Main validation function
async function validateDeployment() {
  let hasErrors = false;
  let hasWarnings = false;

  log.title('Deployment Validation');
  log.info('Verifying configuration before deployment...');

  // Check for required environment variables
  log.title('1. Environment Variables');
  const missingEnvVars = [];
  const placeholderEnvVars = [];

  for (const envVar of REQUIRED_ENV_VARS) {
    const value = process.env[envVar];
    if (!value) {
      missingEnvVars.push(envVar);
    } else if (
      value.includes('placeholder') || 
      value.includes('YOUR_') || 
      value === 'xxx' || 
      value === 'undefined'
    ) {
      placeholderEnvVars.push(envVar);
    }
  }

  if (missingEnvVars.length === 0) {
    log.success('All required environment variables are set');
  } else {
    hasErrors = true;
    log.error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
    log.info('These need to be set in .env.local or in your hosting environment');
  }

  if (placeholderEnvVars.length > 0) {
    hasWarnings = true;
    log.warning(`Placeholder values detected for: ${placeholderEnvVars.join(', ')}`);
    log.info('Replace these with actual values before deployment');
  }

  // Check for required files
  log.title('2. Required Files');
  const missingFiles = [];

  for (const file of REQUIRED_FILES) {
    if (!fs.existsSync(path.resolve(file))) {
      missingFiles.push(file);
    }
  }

  if (missingFiles.length === 0) {
    log.success('All required files are present');
  } else {
    hasErrors = true;
    log.error(`Missing required files: ${missingFiles.join(', ')}`);
  }

  // Check Firebase configuration
  log.title('3. Firebase Configuration');
  
  const firebaseFile = path.resolve('src/utils/firebase.ts');
  if (fs.existsSync(firebaseFile)) {
    const firebaseContent = fs.readFileSync(firebaseFile, 'utf8');
    if (firebaseContent.includes('isFirebaseConfigured')) {
      log.success('Firebase configuration check is implemented');
    } else {
      hasWarnings = true;
      log.warning('Firebase configuration validation not found');
    }
  }

  // Verify Next.js configuration
  log.title('4. Next.js Configuration');
  
  const nextConfigFile = path.resolve('next.config.js');
  if (fs.existsSync(nextConfigFile)) {
    const nextConfig = fs.readFileSync(nextConfigFile, 'utf8');
    
    if (nextConfig.includes('remotePatterns') || nextConfig.includes('domains')) {
      log.success('Image configuration is present');
    } else {
      hasWarnings = true;
      log.warning('Image configuration not found in next.config.js');
    }
  }

  // Check for build-breaking issues
  log.title('5. Build Verification');
  
  try {
    log.info('Running TypeScript check...');
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    log.success('TypeScript check passed');
  } catch (error) {
    hasErrors = true;
    log.error('TypeScript check failed');
    console.log(error.stdout?.toString() || error.message);
  }

  // Summary
  log.title('Validation Summary');
  if (hasErrors) {
    log.error('Validation failed with errors. Fix these issues before deploying.');
    process.exit(1);
  } else if (hasWarnings) {
    log.warning('Validation passed with warnings. Review them before deploying.');
    process.exit(0);
  } else {
    log.success('All validation checks passed! Ready for deployment.');
    process.exit(0);
  }
}

// Run the validation
validateDeployment().catch(err => {
  log.error('Validation script error: ' + err.message);
  process.exit(1);
});

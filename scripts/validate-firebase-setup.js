/**
 * Firebase Setup Validation Script
 * 
 * This script validates the Firebase configuration and environment variables
 * to ensure proper setup before deployment.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.blue}======================================${colors.reset}`);
console.log(`${colors.blue}   Firebase Setup Validation Script   ${colors.reset}`);
console.log(`${colors.blue}======================================${colors.reset}`);

// Track validation results
const results = {
  passed: 0,
  warnings: 0,
  errors: 0
};

// Validate environment variables
function validateEnvironmentVariables() {
  console.log(`\n${colors.magenta}Validating Environment Variables...${colors.reset}`);
  
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];
  
  let allGood = true;
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      console.log(`${colors.red}✖ Missing ${varName}${colors.reset}`);
      allGood = false;
      results.errors++;
    } else if (process.env[varName].includes('placeholder') || 
               process.env[varName].includes('your-') ||
               process.env[varName] === '') {
      console.log(`${colors.yellow}⚠ ${varName} appears to be a placeholder value${colors.reset}`);
      allGood = false;
      results.warnings++;
    } else {
      console.log(`${colors.green}✓ ${varName} is set${colors.reset}`);
      results.passed++;
    }
  });
  
  if (allGood) {
    console.log(`${colors.green}✓ All environment variables are properly set${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠ Some environment variables are missing or appear to be placeholders${colors.reset}`);
  }
  
  return allGood;
}

// Validate Firebase files
function validateFirebaseFiles() {
  console.log(`\n${colors.magenta}Validating Firebase Files...${colors.reset}`);
  
  const files = [
    { path: 'firebase.json', required: false },
    { path: 'firebase.rules', required: true },
    { path: 'src/utils/firebase-service.ts', required: true },
    { path: 'src/utils/FirebaseAuthContext-new.tsx', required: true },
    { path: 'src/utils/firestore-error-handler.ts', required: true }
  ];
  
  let allGood = true;
  
  files.forEach(file => {
    if (fs.existsSync(file.path)) {
      console.log(`${colors.green}✓ ${file.path} exists${colors.reset}`);
      results.passed++;
    } else if (file.required) {
      console.log(`${colors.red}✖ Required file ${file.path} is missing${colors.reset}`);
      allGood = false;
      results.errors++;
    } else {
      console.log(`${colors.yellow}⚠ Optional file ${file.path} is missing${colors.reset}`);
      results.warnings++;
    }
  });
  
  return allGood;
}

// Validate Firebase rules syntax
function validateFirebaseRules() {
  console.log(`\n${colors.magenta}Validating Firestore Rules Syntax...${colors.reset}`);
  
  if (!fs.existsSync('firebase.rules')) {
    console.log(`${colors.red}✖ firebase.rules file not found${colors.reset}`);
    results.errors++;
    return false;
  }
  
  try {
    // Basic syntax validation - check for matching braces
    const rulesContent = fs.readFileSync('firebase.rules', 'utf8');
    const openBraces = (rulesContent.match(/{/g) || []).length;
    const closeBraces = (rulesContent.match(/}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      console.log(`${colors.red}✖ Firebase rules have mismatched braces: ${openBraces} opening vs ${closeBraces} closing${colors.reset}`);
      results.errors++;
      return false;
    }
    
    console.log(`${colors.green}✓ Firebase rules syntax looks valid${colors.reset}`);
    results.passed++;
    
    // Check for recommended rule patterns
    const patterns = {
      'isSignedIn': rulesContent.includes('isSignedIn()'),
      'isOwner': rulesContent.includes('isOwner('),
      'resource validation': rulesContent.includes('request.resource.data'),
      'collection security': rulesContent.includes('match /') && rulesContent.includes('/documents/')
    };
    
    for (const [pattern, found] of Object.entries(patterns)) {
      if (found) {
        console.log(`${colors.green}✓ Rules include ${pattern} pattern${colors.reset}`);
        results.passed++;
      } else {
        console.log(`${colors.yellow}⚠ Rules may be missing ${pattern} pattern${colors.reset}`);
        results.warnings++;
      }
    }
    
    return true;
  } catch (error) {
    console.log(`${colors.red}✖ Error validating Firebase rules: ${error.message}${colors.reset}`);
    results.errors++;
    return false;
  }
}

// Validate Firebase service implementation
function validateFirebaseService() {
  console.log(`\n${colors.magenta}Validating Firebase Service Implementation...${colors.reset}`);
  
  if (!fs.existsSync('src/utils/firebase-service.ts')) {
    console.log(`${colors.red}✖ firebase-service.ts file not found${colors.reset}`);
    results.errors++;
    return false;
  }
  
  try {
    const serviceContent = fs.readFileSync('src/utils/firebase-service.ts', 'utf8');
    
    // Check for key implementation patterns
    const patterns = {
      'Initialization guard': serviceContent.includes('executeWithInitGuard'),
      'Error handling': serviceContent.includes('handleFirebaseError'),
      'Auth state management': serviceContent.includes('authStateListeners'),
      'Queued operations': serviceContent.includes('operationQueue'),
      'Environment awareness': serviceContent.includes('isClient')
    };
    
    for (const [pattern, found] of Object.entries(patterns)) {
      if (found) {
        console.log(`${colors.green}✓ Service implements ${pattern}${colors.reset}`);
        results.passed++;
      } else {
        console.log(`${colors.red}✖ Service is missing ${pattern}${colors.reset}`);
        results.errors++;
      }
    }
    
    return Object.values(patterns).every(Boolean);
  } catch (error) {
    console.log(`${colors.red}✖ Error validating Firebase service: ${error.message}${colors.reset}`);
    results.errors++;
    return false;
  }
}

// Run all validations
function runValidations() {
  const envValid = validateEnvironmentVariables();
  const filesValid = validateFirebaseFiles();
  const rulesValid = validateFirebaseRules();
  const serviceValid = validateFirebaseService();
  
  console.log(`\n${colors.blue}======================================${colors.reset}`);
  console.log(`${colors.blue}   Validation Results Summary   ${colors.reset}`);
  console.log(`${colors.blue}======================================${colors.reset}`);
  console.log(`${colors.green}✓ Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.yellow}⚠ Warnings: ${results.warnings}${colors.reset}`);
  console.log(`${colors.red}✖ Errors: ${results.errors}${colors.reset}`);
  
  if (results.errors === 0) {
    if (results.warnings === 0) {
      console.log(`\n${colors.green}All validations passed successfully!${colors.reset}`);
    } else {
      console.log(`\n${colors.yellow}Validation completed with warnings. Please review the warnings above.${colors.reset}`);
    }
  } else {
    console.log(`\n${colors.red}Validation failed with ${results.errors} errors. Please fix the issues above.${colors.reset}`);
  }
}

// Run the validation
runValidations();

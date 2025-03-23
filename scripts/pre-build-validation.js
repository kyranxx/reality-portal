#!/usr/bin/env node

/**
 * Pre-build validation script to catch client/server component issues
 * Run this before deployment to catch potential build errors
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Colors for terminal output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

console.log('Running pre-build validation for server/client components...');

let errors = 0;
let warnings = 0;

// Check for backup files that might cause webpack errors
const backupFiles = glob.sync('src/**/*.backup');
if (backupFiles.length > 0) {
  console.error(`${RED}ERROR: Found ${backupFiles.length} .backup files that will cause webpack errors:${RESET}`);
  backupFiles.forEach(file => console.error(`  - ${file}`));
  errors++;
}

// Check for client components outside the client directory pattern
const clientComponentFiles = glob.sync('src/**/*.{js,jsx,ts,tsx}');
clientComponentFiles.forEach(file => {
  if (file.includes('/client/') || file.includes('Client.')) {
    // This should be a client component - validate it has 'use client'
    const content = fs.readFileSync(file, 'utf8');
    if (!content.trim().startsWith("'use client'") && !content.trim().startsWith('"use client"')) {
      console.warn(`${YELLOW}WARNING: Client component missing 'use client' directive: ${file}${RESET}`);
      warnings++;
    }
  } else {
    // This should be a server component - validate it DOESN'T export metadata AND have 'use client'
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('export const metadata') && 
        (content.includes("'use client'") || content.includes('"use client"'))) {
      console.error(`${RED}ERROR: Server component with metadata is marked as client: ${file}${RESET}`);
      errors++;
    }
  }
});

// Check for old style dynamic imports
const oldStyleImports = glob.sync('src/**/*.{js,jsx,ts,tsx}').filter(file => {
  const content = fs.readFileSync(file, 'utf8');
  return content.includes('import(`@/') || content.includes("import('@/");
});

if (oldStyleImports.length > 0) {
  console.warn(`${YELLOW}WARNING: Found ${oldStyleImports.length} files with string template imports that may cause issues:${RESET}`);
  oldStyleImports.forEach(file => console.warn(`  - ${file}`));
  warnings++;
}

// Check registry completeness - all client components should be registered
const clientFiles = glob.sync('src/**/Client*.{jsx,tsx}');
const registryContent = fs.readFileSync(path.join(__dirname, '../src/client/registry.ts'), 'utf8');

clientFiles.forEach(file => {
  const componentName = path.basename(file).replace(/\.(jsx|tsx)$/, '');
  if (!registryContent.includes(`'${componentName}'`) && !registryContent.includes(`"${componentName}"`) &&
      !registryContent.includes(`${componentName}:`)) {
    console.warn(`${YELLOW}WARNING: Client component not registered in registry: ${componentName}${RESET}`);
    warnings++;
  }
});

// Summary
if (errors === 0 && warnings === 0) {
  console.log(`${GREEN}✓ Validation passed with no issues!${RESET}`);
  process.exit(0);
} else {
  console.log(`\nValidation summary:`);
  if (errors > 0) {
    console.error(`${RED}✗ Found ${errors} error(s) that will cause build failures${RESET}`);
  }
  if (warnings > 0) {
    console.warn(`${YELLOW}⚠ Found ${warnings} warning(s) that may cause issues${RESET}`);
  }
  
  if (errors > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

#!/usr/bin/env node

/**
 * Pre-build validation script to catch client/server component issues
 * This enhanced script validates the new architecture that uses explicit component registry
 * instead of dynamic imports to prevent Vercel deployment errors.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { execSync } = require('child_process');

// Colors for terminal output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

console.log(`${CYAN}Running enhanced pre-build validation for production deployments...${RESET}`);

let errors = 0;
let warnings = 0;

// Check for backup files that might cause webpack errors
const backupFiles = glob.sync('src/**/*.backup');
if (backupFiles.length > 0) {
  console.error(
    `${RED}ERROR: Found ${backupFiles.length} .backup files that will cause webpack errors:${RESET}`
  );
  backupFiles.forEach(file => console.error(`  - ${file}`));
  errors++;
}

// Check for proper architecture implementation
const pageFiles = glob.sync('src/app/**/page.{js,jsx,ts,tsx}');
pageFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Check that pages use the UniversalComponentLoader instead of ClientComponentLoader
  if (content.includes('ClientComponentLoader') && !content.includes('UniversalComponentLoader')) {
    console.error(
      `${RED}ERROR: Page using deprecated ClientComponentLoader instead of UniversalComponentLoader: ${file}${RESET}`
    );
    errors++;
  }

  // Check that no path aliases are used for critical components
  if (content.includes('import') && content.includes('@/client')) {
    console.error(
      `${RED}ERROR: Page using @/client path alias which fails in production: ${file}${RESET}`
    );
    errors++;
  }
});

// Check client components
const clientComponentFiles = glob.sync('src/**/*Client.{jsx,tsx}');
clientComponentFiles.forEach(file => {
  // All client components must have 'use client' directive
  const content = fs.readFileSync(file, 'utf8');
  if (!content.trim().startsWith("'use client'") && !content.trim().startsWith('"use client"')) {
    console.error(`${RED}ERROR: Client component missing 'use client' directive: ${file}${RESET}`);
    errors++;
  }
});

// Validate server components
const serverComponentFiles = glob.sync('src/app/**/*.{js,jsx,ts,tsx}');
serverComponentFiles.forEach(file => {
  // Skip client components and special files
  if (
    file.includes('Client.') ||
    file.includes('/_client-loader') ||
    file.includes('/_components')
  ) {
    return;
  }

  // Server components shouldn't have 'use client'
  const content = fs.readFileSync(file, 'utf8');
  const hasMetadata = content.includes('export const metadata');
  const hasUseClient =
    content.trim().startsWith("'use client'") || content.trim().startsWith('"use client"');

  if (hasUseClient) {
    if (hasMetadata) {
      console.error(
        `${RED}ERROR: Server component with metadata is marked as client: ${file}${RESET}`
      );
      errors++;
    } else {
      console.warn(`${YELLOW}WARNING: Server component marked with 'use client': ${file}${RESET}`);
      warnings++;
    }
  }
});

// Verify components registry has all required components
let componentsRegistryContent = '';
try {
  componentsRegistryContent = fs.readFileSync(
    path.join(process.cwd(), 'src/app/_components.tsx'),
    'utf8'
  );
} catch (error) {
  console.error(`${RED}ERROR: Missing src/app/_components.tsx registry file${RESET}`);
  errors++;
}

if (componentsRegistryContent) {
  // Check that each client component is in the registry
  clientComponentFiles.forEach(file => {
    const componentName = path.basename(file).replace(/\.(jsx|tsx)$/, '');
    // Skip ClientComponentLoader and auth client components
    if (
      componentName === 'ClientComponentLoader' ||
      file.includes('/auth/client/') ||
      componentName === 'SocialAuthButtonClient' ||
      componentName === 'PasswordInputClient' ||
      componentName === 'FormInputClient' ||
      componentName === 'AuthButtonClient'
    ) {
      return;
    }

    if (
      !componentsRegistryContent.includes(`${componentName}:`) &&
      !componentsRegistryContent.includes(`'${componentName}'`) &&
      !componentsRegistryContent.includes(`"${componentName}"`)
    ) {
      console.error(
        `${RED}ERROR: Client component not registered in _components.tsx: ${componentName}${RESET}`
      );
      errors++;
    }
  });
}

// Check for problematic dynamic imports
const oldStyleImports = glob.sync('src/**/*.{js,jsx,ts,tsx}').filter(file => {
  // Skip known safe files
  if (
    file.includes('firebase-auth-unified.ts') ||
    file.includes('/_client-loader') ||
    file.includes('/_components')
  ) {
    return false;
  }

  const content = fs.readFileSync(file, 'utf8');

  // Detect string template imports and path aliases in dynamic imports
  const problematicPatterns = [
    /import\([`'"]\$\{/, // String template literals
    /import\([`'"]@\//, // Path aliases
    /import\([`'"]\.\.\/\.\.\/\.\.\//, // Deep relative paths that might be problematic
  ];

  return problematicPatterns.some(pattern => pattern.test(content));
});

if (oldStyleImports.length > 0) {
  console.error(
    `${RED}ERROR: Found ${oldStyleImports.length} files with problematic dynamic imports:${RESET}`
  );
  oldStyleImports.forEach(file => console.error(`  - ${file}`));
  errors++;
}

// Run the client component registration validator
try {
  console.log(`\n${CYAN}Running client component registration validator...${RESET}`);
  execSync('node scripts/validate-client-components.js', { stdio: 'inherit' });
} catch (error) {
  console.error(`${RED}Client component validation failed${RESET}`);
  errors++;
}

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

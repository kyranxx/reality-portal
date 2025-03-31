/**
 * Pre-build Component Registration Check
 * 
 * This script is meant to be run as part of the build process to ensure
 * all client components are properly registered in both _components.tsx and _client-loader.tsx
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

console.log(`${colors.blue}${colors.bright}Running client component registration check...${colors.reset}`);

// Paths to the component files
const componentsPath = path.join(process.cwd(), 'src', 'app', '_components.tsx');
const clientLoaderPath = path.join(process.cwd(), 'src', 'app', '_client-loader.tsx');

// Check if files exist
if (!fs.existsSync(componentsPath)) {
  console.error(`${colors.red}Error: ${componentsPath} does not exist${colors.reset}`);
  process.exit(1);
}

if (!fs.existsSync(clientLoaderPath)) {
  console.error(`${colors.red}Error: ${clientLoaderPath} does not exist${colors.reset}`);
  process.exit(1);
}

// Read the files
try {
  const componentsContent = fs.readFileSync(componentsPath, 'utf8');
  const clientLoaderContent = fs.readFileSync(clientLoaderPath, 'utf8');

  // Extract component names from CLIENT_COMPONENTS in _components.tsx
  const clientComponentsMatch = componentsContent.match(/export const CLIENT_COMPONENTS = \{([^}]+)\}/s);
  if (!clientComponentsMatch) {
    console.error(`${colors.red}❌ Could not find CLIENT_COMPONENTS in _components.tsx${colors.reset}`);
    process.exit(1);
  }

  const componentLines = clientComponentsMatch[1].split('\n');
  const componentKeys = componentLines
    .map(line => {
      const match = line.match(/\s*(\w+):/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  // Extract component names from STATIC_COMPONENTS in _client-loader.tsx
  const staticComponentsMatch = clientLoaderContent.match(/const STATIC_COMPONENTS = \{([^}]+)\}/s);
  if (!staticComponentsMatch) {
    console.error(`${colors.red}❌ Could not find STATIC_COMPONENTS in _client-loader.tsx${colors.reset}`);
    process.exit(1);
  }

  const staticComponentLines = staticComponentsMatch[1].split('\n');
  const staticComponentKeys = staticComponentLines
    .map(line => {
      const match = line.match(/\s*(\w+):/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  // Find missing components
  const missingComponents = componentKeys.filter(key => !staticComponentKeys.includes(key));

  if (missingComponents.length === 0) {
    console.log(`${colors.green}✅ All client components are properly registered!${colors.reset}`);
  } else {
    console.error(`${colors.red}❌ Found ${missingComponents.length} component(s) missing from STATIC_COMPONENTS:${colors.reset}`);
    console.error(`${colors.yellow}${missingComponents.join(', ')}${colors.reset}`);
    console.error(`\n${colors.red}Build failed: Component registration mismatch${colors.reset}`);
    
    // Print instructions for fixing
    console.log(`\n${colors.cyan}${colors.bright}To fix this issue:${colors.reset}`);
    console.log(`${colors.cyan}1. Add the missing imports to _client-loader.tsx${colors.reset}`);
    
    // Suggest import statements
    missingComponents.forEach(component => {
      // Find the import line in _components.tsx
      const importRegex = new RegExp(`import ${component}Component from [^;]+;`);
      const importMatch = componentsContent.match(importRegex);
      if (importMatch) {
        console.log(`   ${importMatch[0]}`);
      }
    });
    
    console.log(`\n${colors.cyan}2. Add the missing components to STATIC_COMPONENTS:${colors.reset}`);
    
    // Suggest component registrations
    missingComponents.forEach(component => {
      console.log(`   ${component}: ${component}Component,`);
    });
    
    // Auto-fix option
    console.log(`\n${colors.cyan}3. Or run the sync-component-registrations.js script to see detailed information:${colors.reset}`);
    console.log(`   node scripts/sync-component-registrations.js`);
    
    process.exit(1);
  }

} catch (error) {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
}

console.log(`${colors.blue}Component registration check completed successfully.${colors.reset}`);

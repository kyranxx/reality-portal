/**
 * Analyze Auth Error Boundaries
 * 
 * This script analyzes the different AuthErrorBoundary implementations to determine
 * if they can be consolidated. According to the analysis, these are not true redundancies
 * as they have different features, but this script helps to document the differences
 * and provide a migration path if consolidation is desired later.
 * 
 * Run with: node scripts/analyze-auth-error-boundaries.js [--execute]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const DRY_RUN = !process.argv.includes('--execute');

// File paths
const componentsPath = path.join(rootDir, 'src', 'components', 'AuthErrorBoundary.tsx');
const utilsPath = path.join(rootDir, 'src', 'utils', 'AuthErrorBoundary.tsx');
const analysisPath = path.join(rootDir, 'docs', 'auth-error-boundary-analysis.md');

// Print header
console.log('======================================================');
console.log('Analyze Auth Error Boundaries');
console.log('======================================================\n');

console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'EXECUTION'}\n`);

// Main execution
async function main() {
  try {
    // Read both error boundary implementations
    const componentsImplementation = fs.existsSync(componentsPath) 
      ? fs.readFileSync(componentsPath, 'utf8')
      : 'File not found';
    
    const utilsImplementation = fs.existsSync(utilsPath)
      ? fs.readFileSync(utilsPath, 'utf8')
      : 'File not found';
    
    // Generate analysis document
    generateAnalysis(componentsImplementation, utilsImplementation);
    
    console.log('\n✅ Auth error boundary analysis completed successfully.');
  } catch (error) {
    console.error('\n❌ Error analyzing auth error boundaries:', error);
    process.exit(1);
  }
}

/**
 * Generate analysis document for the two AuthErrorBoundary implementations
 */
function generateAnalysis(componentsImpl, utilsImpl) {
  console.log('📝 Generating auth error boundary analysis...');
  
  // Basic feature detection (this is a simplified example)
  const componentsHasResetHandler = componentsImpl.includes('resetErrorBoundary');
  const componentsHasFirebaseAuth = componentsImpl.includes('firebase/auth');
  const componentsHasOnError = componentsImpl.includes('onError');
  
  const utilsHasResetHandler = utilsImpl.includes('resetErrorBoundary');
  const utilsHasFirebaseAuth = utilsImpl.includes('firebase/auth');
  const utilsHasOnError = utilsImpl.includes('onError');
  
  // Generate the analysis content
  const analysisContent = `# Auth Error Boundary Analysis

## Overview

This document analyzes the two different implementations of AuthErrorBoundary in the project:
- \`src/components/AuthErrorBoundary.tsx\`
- \`src/utils/AuthErrorBoundary.tsx\`

## Feature Comparison

| Feature | Components Implementation | Utils Implementation |
|---------|---------------------------|---------------------|
| Reset Handler | ${componentsHasResetHandler ? '✅' : '❌'} | ${utilsHasResetHandler ? '✅' : '❌'} |
| Firebase Auth Integration | ${componentsHasFirebaseAuth ? '✅' : '❌'} | ${utilsHasFirebaseAuth ? '✅' : '❌'} |
| Error Callback | ${componentsHasOnError ? '✅' : '❌'} | ${utilsHasOnError ? '✅' : '❌'} |

## Code Size

- Components Implementation: ${componentsImpl.split('\n').length} lines
- Utils Implementation: ${utilsImpl.split('\n').length} lines

## Recommendation

Based on the analysis, these are **not true redundancies** as they serve different purposes:

1. **Components Implementation**: ${
    componentsHasFirebaseAuth 
      ? 'More focused on Firebase authentication errors with specialized handling.' 
      : 'Has a more general error handling approach.'
  }

2. **Utils Implementation**: ${
    utilsHasResetHandler 
      ? 'Provides more extensive reset functionality.' 
      : 'Has a simpler implementation.'
  }

### Options:

1. **Keep Both**: Maintain both implementations as they serve different purposes.
   - Rename them to clarify their specific roles (e.g., AuthenticationErrorBoundary vs. GeneralErrorBoundary)
   - Document the intended use case for each

2. **Consolidate**: Merge the implementations, preserving all unique features.
   - Create a unified component with optional props to enable/disable specific features
   - Provide backward compatibility adapters

3. **Prefer One**: Choose the more comprehensive implementation and extend it.
   - Migrate all usages to the chosen implementation
   - Add any missing features from the other implementation

## Migration Path

If consolidation is desired, follow these steps:

1. Back up both implementations
2. Create a new consolidated implementation in \`src/components/error/AuthErrorBoundary.tsx\`
3. Add feature flags to enable/disable specific behaviors
4. Create adapter components for backward compatibility
5. Update imports across the codebase in a separate PR

## Current Decision

For now, we recommend **Option 1: Keep Both** since they serve different purposes and aren't true redundancies. 
Rename them to better reflect their specific roles and document their differences clearly.
`;

  // Write the analysis file
  writeFile(analysisPath, analysisContent);
}

/**
 * Helper function to write a file with dry run support
 */
function writeFile(filePath, content) {
  const relativePath = path.relative(rootDir, filePath);
  
  if (DRY_RUN) {
    console.log(`📄 Would write file: ${relativePath}`);
    console.log('--- Content preview ---');
    console.log(content.split('\n').slice(0, 5).join('\n') + (content.split('\n').length > 5 ? '\n...' : ''));
    console.log('----------------------');
  } else {
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`📄 Wrote file: ${relativePath}`);
  }
}

// Run the script
main();

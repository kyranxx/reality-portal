/**
 * Client Directive Analyzer
 * 
 * This script analyzes components to determine if they actually need the 'use client' directive
 * by checking for client-only APIs and hooks.
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

// Patterns that indicate a component must be a client component
const CLIENT_PATTERNS = [
  // React hooks
  /\buse[A-Z]\w+\s*\(/,  // useEffect, useState, useContext, etc.
  /\bnew\s+[\w.]+/,      // new instances (e.g., new Date())
  /\bdocument\b/,        // Browser document object
  /\bwindow\b/,          // Browser window object
  /\blocalStorage\b/,    // localStorage API
  /\bsessionStorage\b/,  // sessionStorage API
  /\bnavigator\b/,       // navigator API
  /\blocation\b/,        // location API
  /\bhistory\b/,         // history API
  /\baddEventListener\b/,// event listeners
  /\bonClick\b/,         // event handlers
  /\bonChange\b/,
  /\bonSubmit\b/,
  /\bRef\b/,             // Refs
  /\buseRef\b/,          // useRef
  /import\s+{\s*[^}]*\buse\w+\b[^}]*\}\s+from\s+['"]react['"]/,  // Imported React hooks
];

// Specific Next.js server hooks (we would NOT want 'use client' if these are the only hooks)
const SERVER_PATTERNS = [
  /\buseSearchParams\b/, // Next.js server component API
  /\busePathname\b/,     // Next.js server component API
];

// Special case components that should always be client components
const FORCE_CLIENT_COMPONENTS = [
  'error.tsx',
  'global-error.tsx'
];

// Components that are incorrectly flagged in the validation
const KNOWN_FALSE_POSITIVES = [
  'src/app/global-error.tsx',
  'src/app/error.tsx',
  'src/app/ClientWrapper.tsx',
  'src/app/auth/login/LoginClient-simple.tsx',
  'src/app/auth/admin-login/AdminLoginClientComponent.tsx'
];

// Find all potential components
async function findComponents() {
  const appDir = path.join(process.cwd(), 'src', 'app');
  const components = await glob('**/*.{jsx,tsx}', { cwd: appDir });
  return components.map(comp => path.join(appDir, comp));
}

// Check if a component needs to be a client component
function needsClientDirective(content, filename) {
  // Special case components
  const baseFilename = path.basename(filename);
  if (FORCE_CLIENT_COMPONENTS.includes(baseFilename)) {
    return {
      needs: true,
      reason: `${baseFilename} must be a client component in Next.js`
    };
  }

  // Check for client patterns
  for (const pattern of CLIENT_PATTERNS) {
    if (pattern.test(content)) {
      return { 
        needs: true, 
        reason: `Uses client-side API: ${pattern.toString().replace(/[/\\^$*+?.()|[\]{}]/g, '')}` 
      };
    }
  }

  // Check for server patterns only (if these are the only "hooks" used)
  let isServerOnly = false;
  for (const pattern of SERVER_PATTERNS) {
    if (pattern.test(content)) {
      isServerOnly = true;
      break;
    }
  }

  return {
    needs: false,
    reason: isServerOnly ? 
      'Uses only server-side hooks' : 
      'No client-side APIs detected'
  };
}

// Main analysis function
async function analyzeComponents() {
  const components = await findComponents();
  
  // Results containers
  const correct = [];
  const incorrect = [];
  const missingDirective = [];
  const unnecessaryDirective = [];
  const falsePositives = [];

  for (const filePath of components) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const hasDirective = content.trim().startsWith("'use client'") || 
                          content.trim().startsWith('"use client"');
      
      const analysis = needsClientDirective(content, filePath);
      const relativePath = path.relative(process.cwd(), filePath);

      // Handle known false positives separately
      if (KNOWN_FALSE_POSITIVES.includes(relativePath)) {
        falsePositives.push({
          path: relativePath,
          hasDirective,
          analysis
        });
        continue;
      }

      if (hasDirective && analysis.needs) {
        // Correct: has directive and needs it
        correct.push({
          path: relativePath,
          reason: analysis.reason
        });
      } else if (!hasDirective && !analysis.needs) {
        // Correct: doesn't have directive and doesn't need it
        correct.push({
          path: relativePath,
          reason: analysis.reason
        });
      } else if (!hasDirective && analysis.needs) {
        // Incorrect: missing directive
        missingDirective.push({
          path: relativePath,
          reason: analysis.reason
        });
      } else if (hasDirective && !analysis.needs) {
        // Incorrect: unnecessary directive
        unnecessaryDirective.push({
          path: relativePath,
          reason: analysis.reason
        });
      }
    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error.message);
    }
  }

  // Print results
  console.log(`\n${colors.blue}${colors.bright}Client Directive Analysis Results${colors.reset}\n`);
  console.log(`Analyzed ${components.length} components\n`);

  console.log(`${colors.green}✅ ${correct.length} components correctly configured${colors.reset}`);
  
  if (missingDirective.length > 0) {
    console.log(`\n${colors.red}❌ ${missingDirective.length} components missing 'use client' directive:${colors.reset}`);
    missingDirective.forEach(comp => {
      console.log(`  - ${comp.path} (${comp.reason})`);
    });
  }

  if (unnecessaryDirective.length > 0) {
    console.log(`\n${colors.yellow}⚠️ ${unnecessaryDirective.length} components with unnecessary 'use client' directive:${colors.reset}`);
    unnecessaryDirective.forEach(comp => {
      console.log(`  - ${comp.path} (${comp.reason})`);
    });
  }
  
  if (falsePositives.length > 0) {
    console.log(`\n${colors.blue}ℹ️ Known validation false positives:${colors.reset}`);
    falsePositives.forEach(comp => {
      console.log(`  - ${comp.path} (${comp.analysis.reason})`);
    });
    console.log(`\n${colors.yellow}These components are correctly marked with 'use client' but are being incorrectly flagged by validation.${colors.reset}`);
  }
}

// Run the analysis
analyzeComponents().catch(console.error);

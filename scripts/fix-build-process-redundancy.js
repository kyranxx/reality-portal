/**
 * Fix Build Process Redundancies
 * 
 * This script consolidates multiple overlapping validation scripts:
 * 1. pre-build-validation.js
 * 2. pre-build-component-check.js
 * 3. validate-client-components.js
 * 4. analyze-client-directives.js
 * 
 * It creates a unified validation system in the scripts/validation/ directory.
 */

const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const validationDir = path.join(rootDir, 'scripts', 'validation');
const backupDir = path.join(rootDir, 'backups', 'scripts');

// Source files to consolidate
const sourceFiles = {
  preBuildValidation: path.join(rootDir, 'scripts', 'pre-build-validation.js'),
  preBuildComponentCheck: path.join(rootDir, 'scripts', 'pre-build-component-check.js'),
  validateClientComponents: path.join(rootDir, 'scripts', 'validate-client-components.js'),
  analyzeClientDirectives: path.join(rootDir, 'scripts', 'analyze-client-directives.js')
};

// Create directories if they don't exist
if (!fs.existsSync(validationDir)) {
  fs.mkdirSync(validationDir, { recursive: true });
}

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

console.log('Build Process Validation Consolidation');
console.log('-------------------------------------');

// Check if source files exist
let missingFiles = false;
for (const [name, filePath] of Object.entries(sourceFiles)) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ ${name} not found at ${filePath}`);
    missingFiles = true;
  }
}

if (missingFiles) {
  console.error('Some source files are missing. Please check paths.');
  process.exit(1);
}

console.log('✅ All source files found. Creating consolidated validation framework...');

// Create backups of all source files
for (const [name, filePath] of Object.entries(sourceFiles)) {
  const fileName = path.basename(filePath);
  fs.copyFileSync(filePath, path.join(backupDir, fileName + '.bak'));
}
console.log(`✅ Created backups in ${backupDir}`);

// Create consolidated validation framework

// 1. Main unified validation script
const unifiedValidationScript = `#!/usr/bin/env node

/**
 * Unified Build Validation Script
 * 
 * This script provides a consolidated approach to validating the project before building.
 * It runs all necessary validation modules and reports issues in a standardized format.
 */

const path = require('path');

// Import validation modules
const validateClientComponents = require('./validation/client-components');
const validateFileArchitecture = require('./validation/file-architecture');
const validateClientRegistration = require('./validation/client-registration');
const analyzeClientDirectives = require('./validation/client-directives');

// Terminal colors
const colors = {
  reset: '\\x1b[0m',
  bright: '\\x1b[1m',
  red: '\\x1b[31m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  blue: '\\x1b[36m',
};

// Configuration options
const options = {
  // Parse command line arguments for script options
  checkClientComponents: !process.argv.includes('--skip-client-components'),
  checkClientDirectives: !process.argv.includes('--skip-client-directives'),
  checkFileArchitecture: !process.argv.includes('--skip-file-architecture'),
  checkRegistration: !process.argv.includes('--skip-registration'),
  fix: process.argv.includes('--fix'),
  verbose: process.argv.includes('--verbose'),
};

console.log(\`\${colors.blue}\${colors.bright}Running unified build validation...\${colors.reset}\\n\`);

// Track issues
let errors = 0;
let warnings = 0;
let fixes = 0;

// Run validations
async function runValidations() {
  try {
    // Validate client component basics
    if (options.checkClientComponents) {
      console.log(\`\${colors.blue}Validating client components...\${colors.reset}\`);
      const clientComponentResults = await validateClientComponents(options);
      errors += clientComponentResults.errors;
      warnings += clientComponentResults.warnings;
      fixes += clientComponentResults.fixes;
    }

    // Validate file architecture
    if (options.checkFileArchitecture) {
      console.log(\`\${colors.blue}Validating file architecture...\${colors.reset}\`);
      const fileArchitectureResults = await validateFileArchitecture(options);
      errors += fileArchitectureResults.errors;
      warnings += fileArchitectureResults.warnings;
      fixes += fileArchitectureResults.fixes;
    }

    // Validate client registration
    if (options.checkRegistration) {
      console.log(\`\${colors.blue}Validating client component registration...\${colors.reset}\`);
      const registrationResults = await validateClientRegistration(options);
      errors += registrationResults.errors;
      warnings += registrationResults.warnings;
      fixes += registrationResults.fixes;
    }

    // Analyze client directives
    if (options.checkClientDirectives) {
      console.log(\`\${colors.blue}Analyzing client directives...\${colors.reset}\`);
      const directiveResults = await analyzeClientDirectives(options);
      errors += directiveResults.errors;
      warnings += directiveResults.warnings;
      fixes += directiveResults.fixes;
    }

    // Show summary
    console.log(\\n\`\${colors.blue}\${colors.bright}Validation Summary:\${colors.reset}\`);
    
    if (errors === 0 && warnings === 0) {
      console.log(\`\${colors.green}✓ All validations passed successfully!\${colors.reset}\`);
    } else {
      if (errors > 0) {
        console.log(\`\${colors.red}✗ Found \${errors} error(s)\${colors.reset}\`);
      }
      if (warnings > 0) {
        console.log(\`\${colors.yellow}⚠ Found \${warnings} warning(s)\${colors.reset}\`);
      }
      if (fixes > 0 && options.fix) {
        console.log(\`\${colors.green}✓ Applied \${fixes} automatic fix(es)\${colors.reset}\`);
      }
    }

    // Exit with appropriate code
    if (errors > 0) {
      console.log(\`\${colors.red}Build validation failed. Fix the errors and try again.\${colors.reset}\`);
      process.exit(1);
    } else {
      console.log(\`\${colors.green}Build validation completed successfully.\${colors.reset}\`);
      process.exit(0);
    }
  } catch (error) {
    console.error(\`\${colors.red}Error during validation: \${error.message}\${colors.reset}\`);
    console.error(error);
    process.exit(1);
  }
}

// Run all validations
runValidations();
`;

// 2. Client component validation module
const clientComponentsModule = `/**
 * Client Component Validation Module
 * 
 * This module validates client components by checking:
 * - Whether they have 'use client' directive
 * - Whether they follow naming conventions
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Terminal colors
const colors = {
  reset: '\\x1b[0m',
  bright: '\\x1b[1m',
  red: '\\x1b[31m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  blue: '\\x1b[36m',
};

/**
 * Validate client components
 */
async function validateClientComponents(options) {
  const results = {
    errors: 0,
    warnings: 0,
    fixes: 0
  };

  // Find all client components
  const clientComponentFiles = glob.sync('src/**/*Client.{jsx,tsx}');
  
  if (options.verbose) {
    console.log(\`Found \${clientComponentFiles.length} client component files to validate\`);
  }
  
  // Validate each client component
  for (const file of clientComponentFiles) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check for 'use client' directive
    const hasUseClient = content.trim().startsWith("'use client'") || 
                          content.trim().startsWith('"use client"');
                          
    if (!hasUseClient) {
      console.error(\`\${colors.red}ERROR: Missing 'use client' directive in \${file}\${colors.reset}\`);
      results.errors++;
      
      // Fix if requested
      if (options.fix) {
        content = "'use client';\\n\\n" + content;
        fs.writeFileSync(file, content, 'utf8');
        console.log(\`\${colors.green}FIXED: Added 'use client' directive to \${file}\${colors.reset}\`);
        results.fixes++;
      }
    }
    
    // Check for proper component naming - export default must match filename
    const filename = path.basename(file, path.extname(file));
    const exportDefaultRegex = new RegExp(\`export\\\\s+default\\\\s+function\\\\s+(\${filename}|(\${filename.replace('Client', '')}))\\\\s*\\\\(`);
    
    if (!exportDefaultRegex.test(content)) {
      console.warn(\`\${colors.yellow}WARNING: Component name might not match filename in \${file}\${colors.reset}\`);
      results.warnings++;
    }
  }
  
  return results;
}

module.exports = validateClientComponents;
`;

// 3. File architecture validation module
const fileArchitectureModule = `/**
 * File Architecture Validation Module
 * 
 * This module validates the project's file architecture by checking:
 * - For backup files that might cause webpack errors
 * - For proper import paths
 * - For problematic dynamic imports
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Terminal colors
const colors = {
  reset: '\\x1b[0m',
  bright: '\\x1b[1m',
  red: '\\x1b[31m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  blue: '\\x1b[36m',
};

/**
 * Validate file architecture
 */
async function validateFileArchitecture(options) {
  const results = {
    errors: 0,
    warnings: 0,
    fixes: 0
  };

  // Check for backup files that might cause webpack errors
  const backupFiles = glob.sync('src/**/*.{backup,bak}');
  if (backupFiles.length > 0) {
    console.error(
      \`\${colors.red}ERROR: Found \${backupFiles.length} backup files that will cause webpack errors:\${colors.reset}\`
    );
    backupFiles.forEach(file => console.error(\`  - \${file}\`));
    results.errors += backupFiles.length;
    
    // Fix if requested
    if (options.fix) {
      backupFiles.forEach(file => {
        const backupDir = path.join(path.dirname(file), '.backups');
        if (!fs.existsSync(backupDir)) {
          fs.mkdirSync(backupDir, { recursive: true });
        }
        const newPath = path.join(backupDir, path.basename(file));
        fs.renameSync(file, newPath);
        console.log(\`\${colors.green}FIXED: Moved \${file} to \${newPath}\${colors.reset}\`);
      });
      results.fixes += backupFiles.length;
    }
  }

  // Check for problematic dynamic imports
  const sourceFiles = glob.sync('src/**/*.{js,jsx,ts,tsx}').filter(file => {
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
      /import\\([\\`'"]\\$\\{/, // String template literals
      /import\\([\\`'"]@\\//, // Path aliases
      /import\\([\\`'"]\\.\\.\\/\\.\\.\\/\\.\\.\\//, // Deep relative paths that might be problematic
    ];

    return problematicPatterns.some(pattern => pattern.test(content));
  });

  if (sourceFiles.length > 0) {
    console.error(
      \`\${colors.red}ERROR: Found \${sourceFiles.length} files with problematic dynamic imports:\${colors.reset}\`
    );
    sourceFiles.forEach(file => console.error(\`  - \${file}\`));
    results.errors += sourceFiles.length;
    
    // We don't automatically fix import patterns as it requires more context
  }

  // Check for proper architecture implementation
  const pageFiles = glob.sync('src/app/**/page.{js,jsx,ts,tsx}');
  pageFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    // Check for proper component loader usage
    if (content.includes('ClientComponentLoader') && !content.includes('UniversalComponentLoader')) {
      console.error(
        \`\${colors.red}ERROR: Page using deprecated ClientComponentLoader: \${file}\${colors.reset}\`
      );
      results.errors++;
    }

    // Check for path aliases for critical components
    if (content.includes('import') && content.includes('@/client')) {
      console.error(
        \`\${colors.red}ERROR: Page using @/client path alias which fails in production: \${file}\${colors.reset}\`
      );
      results.errors++;
    }
  });

  return results;
}

module.exports = validateFileArchitecture;
`;

// 4. Client registration validation module
const clientRegistrationModule = `/**
 * Client Registration Validation Module
 * 
 * This module validates that client components are properly registered in:
 * - _components.tsx (component registry)
 * - _client-loader.tsx (static component map)
 */

const fs = require('fs');
const path = require('path');

// Terminal colors
const colors = {
  reset: '\\x1b[0m',
  bright: '\\x1b[1m',
  red: '\\x1b[31m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  blue: '\\x1b[36m',
};

/**
 * Validate client component registration
 */
async function validateClientRegistration(options) {
  const results = {
    errors: 0,
    warnings: 0,
    fixes: 0
  };

  const componentsPath = path.join(process.cwd(), 'src', 'app', '_components.tsx');
  const clientLoaderPath = path.join(process.cwd(), 'src', 'app', '_client-loader.tsx');

  // Check if files exist
  if (!fs.existsSync(componentsPath)) {
    console.error(\`\${colors.red}ERROR: \${componentsPath} does not exist\${colors.reset}\`);
    results.errors++;
    return results;
  }

  if (!fs.existsSync(clientLoaderPath)) {
    console.error(\`\${colors.red}ERROR: \${clientLoaderPath} does not exist\${colors.reset}\`);
    results.errors++;
    return results;
  }

  // Read the files
  const componentsContent = fs.readFileSync(componentsPath, 'utf8');
  const clientLoaderContent = fs.readFileSync(clientLoaderPath, 'utf8');

  // Extract component names from CLIENT_COMPONENTS in _components.tsx
  const clientComponentsMatch = componentsContent.match(/export const CLIENT_COMPONENTS = \\{([^}]+)\\}/s);
  if (!clientComponentsMatch) {
    console.error(\`\${colors.red}ERROR: Could not find CLIENT_COMPONENTS in _components.tsx\${colors.reset}\`);
    results.errors++;
    return results;
  }

  const componentLines = clientComponentsMatch[1].split('\\n');
  const componentKeys = componentLines
    .map(line => {
      const match = line.match(/\\s*(\\w+):/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  if (options.verbose) {
    console.log(\`Found \${componentKeys.length} components in CLIENT_COMPONENTS\`);
  }

  // Extract component names from STATIC_COMPONENTS in _client-loader.tsx
  const staticComponentsMatch = clientLoaderContent.match(/const STATIC_COMPONENTS = \\{([^}]+)\\}/s);
  if (!staticComponentsMatch) {
    console.error(\`\${colors.red}ERROR: Could not find STATIC_COMPONENTS in _client-loader.tsx\${colors.reset}\`);
    results.errors++;
    return results;
  }

  const staticComponentLines = staticComponentsMatch[1].split('\\n');
  const staticComponentKeys = staticComponentLines
    .map(line => {
      const match = line.match(/\\s*(\\w+):/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  if (options.verbose) {
    console.log(\`Found \${staticComponentKeys.length} components in STATIC_COMPONENTS\`);
  }

  // Find missing components
  const missingComponents = componentKeys.filter(key => !staticComponentKeys.includes(key));

  if (missingComponents.length === 0) {
    console.log(\`\${colors.green}✓ All client components are properly registered!\${colors.reset}\`);
  } else {
    console.error(\`\${colors.red}ERROR: Found \${missingComponents.length} component(s) missing from STATIC_COMPONENTS:\${colors.reset}\`);
    console.error(\`\${colors.yellow}\${missingComponents.join(', ')}\${colors.reset}\`);
    results.errors += missingComponents.length;
    
    // Auto-fix if requested
    if (options.fix) {
      // Build import statements
      let importStatements = '';
      let componentRegistrations = '';
      
      missingComponents.forEach(component => {
        // Find the import line in _components.tsx
        const importRegex = new RegExp(\`import \${component}Component from [^;]+;\`);
        const importMatch = componentsContent.match(importRegex);
        if (importMatch) {
          importStatements += importMatch[0] + '\\n';
          componentRegistrations += \`  \${component}: \${component}Component,\\n\`;
        }
      });
      
      if (importStatements && componentRegistrations) {
        // Add imports at the beginning of imports section
        let updatedClientLoader = clientLoaderContent;
        const lastImportIndex = updatedClientLoader.lastIndexOf('import');
        const lastImportLineEnd = updatedClientLoader.indexOf('\\n', lastImportIndex);
        
        updatedClientLoader = 
          updatedClientLoader.substring(0, lastImportLineEnd + 1) +
          '\\n' + importStatements +
          updatedClientLoader.substring(lastImportLineEnd + 1);
          
        // Add component registrations to STATIC_COMPONENTS
        const staticComponentsStart = updatedClientLoader.indexOf('const STATIC_COMPONENTS = {');
        const staticComponentsFirstBrace = updatedClientLoader.indexOf('{', staticComponentsStart);
        const insertPosition = updatedClientLoader.indexOf('\\n', staticComponentsFirstBrace) + 1;
        
        updatedClientLoader = 
          updatedClientLoader.substring(0, insertPosition) +
          componentRegistrations +
          updatedClientLoader.substring(insertPosition);
          
        // Write the updated content
        fs.writeFileSync(clientLoaderPath, updatedClientLoader, 'utf8');
        console.log(\`\${colors.green}FIXED: Added \${missingComponents.length} missing components to _client-loader.tsx\${colors.reset}\`);
        results.fixes += missingComponents.length;
      }
    }
  }

  return results;
}

module.exports = validateClientRegistration;
`;

// 5. Client directives analysis module
const clientDirectivesModule = `/**
 * Client Directives Analysis Module
 * 
 * This module analyzes components to determine if they actually need
 * the 'use client' directive by checking for client-only APIs and hooks.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Terminal colors
const colors = {
  reset: '\\x1b[0m',
  bright: '\\x1b[1m',
  red: '\\x1b[31m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  blue: '\\x1b[36m',
};

// Patterns that indicate a component must be a client component
const CLIENT_PATTERNS = [
  // React hooks
  /\\buse[A-Z]\\w+\\s*\\(/,  // useEffect, useState, useContext, etc.
  /\\bnew\\s+[\\w.]+/,      // new instances (e.g., new Date())
  /\\bdocument\\b/,        // Browser document object
  /\\bwindow\\b/,          // Browser window object
  /\\blocalStorage\\b/,    // localStorage API
  /\\bsessionStorage\\b/,  // sessionStorage API
  /\\bnavigator\\b/,       // navigator API
  /\\blocation\\b/,        // location API
  /\\bhistory\\b/,         // history API
  /\\baddEventListener\\b/,// event listeners
  /\\bonClick\\b/,         // event handlers
  /\\bonChange\\b/,
  /\\bonSubmit\\b/,
  /\\bRef\\b/,             // Refs
  /\\buseRef\\b/,          // useRef
  /import\\s+{\\s*[^}]*\\buse\\w+\\b[^}]*\\}\\s+from\\s+['"]react['"]/,  // Imported React hooks
];

// Specific Next.js server hooks (we would NOT want 'use client' if these are the only hooks)
const SERVER_PATTERNS = [
  /\\buseSearchParams\\b/, // Next.js server component API
  /\\busePathname\\b/,     // Next.js server component API
];

// Special case components that should always be client components
const FORCE_CLIENT_COMPONENTS = [
  'error.tsx',
  'global-error.tsx'
];

/**
 * Analyze client directives
 */
async function analyzeClientDirectives(options) {
  const results = {
    errors: 0,
    warnings: 0,
    fixes: 0
  };

  // Get all files in the app directory
  const appDir = path.join(process.cwd(), 'src', 'app');
  const componentFiles = glob.sync('**/*.{jsx,tsx}', { cwd: appDir })
    .map(file => path.join(appDir, file));
    
  if (options.verbose) {
    console.log(\`Analyzing \${componentFiles.length} component files\`);
  }

  // Check each file
  for (const file of componentFiles) {
    const baseFilename = path.basename(file);
    const content = fs.readFileSync(file, 'utf8');
    const hasDirective = content.trim().startsWith("'use client'") || 
                         content.trim().startsWith('"use client"');

    // Check if it needs the client directive
    const needsClient = checkIfNeedsClientDirective(content, file);
    
    // Handle special cases first
    if (FORCE_CLIENT_COMPONENTS.includes(baseFilename)) {
      if (!hasDirective) {
        console.error(\`\${colors.red}ERROR: \${baseFilename} must be a client component but is missing 'use client'\${colors.reset}\`);
        results.errors++;
        
        // Fix if requested
        if (options.fix) {
          const updatedContent = "'use client';\\n\\n" + content;
          fs.writeFileSync(file, updatedContent, 'utf8');
          console.log(\`\${colors.green}FIXED: Added 'use client' directive to \${file}\${colors.reset}\`);
          results.fixes++;
        }
      }
      continue;
    }
    
    // Handle component files ending with "Client" - they should always have "use client"
    if (baseFilename.includes('Client.') && !hasDirective) {
      console.error(\`\${colors.red}ERROR: Client component \${baseFilename} is missing 'use client' directive\${colors.reset}\`);
      results.errors++;
      
      // Fix if requested
      if (options.fix) {
        const updatedContent = "'use client';\\n\\n" + content;
        fs.writeFileSync(file, updatedContent, 'utf8');
        console.log(\`\${colors.green}FIXED: Added 'use client' directive to \${file}\${colors.reset}\`);
        results.fixes++;
      }
      continue;
    }
    
    // Check for mismatches between code and directive
    if (needsClient && !hasDirective) {
      console.error(\`\${colors.red}ERROR: Component \${baseFilename} uses client-side APIs but is missing 'use client'\${colors.reset}\`);
      results.errors++;
      
      // Fix if requested
      if (options.fix) {
        const updatedContent = "'use client';\\n\\n" + content;
        fs.writeFileSync(file, updatedContent, 'utf8');
        console.log(\`\${colors.green}FIXED: Added 'use client' directive to \${file}\${colors.reset}\`);
        results.fixes++;
      }
    } else if (!needsClient && hasDirective && !baseFilename.includes('Client.')) {
      console.warn(\`\${colors.yellow}WARNING: Component \${baseFilename} has 'use client' but does not appear to need it\${colors.reset}\`);
      results.warnings++;
      
      // No auto-fix for unnecessary client directive as it may be intentional
    }
  }

  return results;
}

/**
 * Check if a component needs the 'use client' directive
 */
function checkIfNeedsClientDirective(content, filename) {
  // Special case components
  const baseFilename = path.basename(filename);
  if (FORCE_CLIENT_COMPONENTS.includes(baseFilename)) {
    return true;
  }

  // Check for client patterns
  for (const pattern of CLIENT_PATTERNS) {
    if (pattern.test(content)) {
      return true;
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

  // If only server patterns are found, it doesn't need client directive
  return !isServerOnly;
}

module.exports = analyzeClientDirectives;
`;

// 6. Create a unified validation script helper
const validationHelperModule = `/**
 * Validation Helper Module
 * 
 * This module provides shared utilities for the validation framework.
 */

const fs = require('fs');
const path = require('path');

// Terminal colors
const colors = {
  reset: '\\x1b[0m',
  bright: '\\x1b[1m',
  red: '\\x1b[31m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  blue: '\\x1b[36m',
};

/**
 * Check if a file contains a 'use client' directive
 */
function hasUseClientDirective(content) {
  return content.trim().startsWith("'use client'") || 
         content.trim().startsWith('"use client"');
}

/**
 * Create a backup of a file before modifying it
 */
function backupFile(filePath, backupDir) {
  const fileName = path.basename(filePath);
  const backupPath = path.join(backupDir, \`\${fileName}.\${Date.now()}.bak\`);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

module.exports = {
  colors,
  hasUseClientDirective,
  backupFile
};
`;

// 7. Launcher script
const launcherScript = `#!/usr/bin/env node
/**
 * Unified Build Validation Launcher
 * 
 * This script is a shorthand for running the unified-validation.js script.
 * It provides simple options for common validation tasks.
 */

const path = require('path');
const { execSync } = require('child_process');

// Process command line arguments
const args = process.argv.slice(2);
const validationScript = path.join(__dirname, 'validation', 'unified-validation.js');

// Map simple commands to full options
const commands = {
  'all': [],
  'components': ['--skip-file-architecture', '--skip-client-directives'],
  'directives': ['--skip-file-architecture', '--skip-registration', '--skip-client-components'],
  'architecture': ['--skip-client-components', '--skip-client-directives', '--skip-registration'],
  'registration': ['--skip-file-architecture', '--skip-client-directives', '--skip-client-components'],
  'fix': ['--fix'],
  'pre-build': [], // Run everything for pre-build checks
  'verbose': ['--verbose'],
  'help': ['--help']
};

// Show help if requested or no args provided
if (args.includes('help') || args.length === 0) {
  console.log(\`
Unified Build Validation Tool

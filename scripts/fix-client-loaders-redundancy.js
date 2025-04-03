/**
 * Fix Client Loaders Redundancy
 * 
 * This script consolidates the client component loaders to eliminate redundancy between:
 * - backups/remaining-redundancies/ClientComponentLoader.tsx.bak (former src/client/ClientComponentLoader.tsx)
 * - backups/remaining-redundancies/registry.ts.bak (former src/client/registry.ts)
 * - src/app/_client-loader.tsx
 * - src/app/_components.tsx
 * 
 * The App Router implementation is more robust and comprehensive, so we'll keep that
 * and create adapter files for backward compatibility.
 * 
 * Run with: node scripts/fix-client-loaders-redundancy.js [--execute]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const DRY_RUN = !process.argv.includes('--execute');

// File paths
const backupsDir = path.join(rootDir, 'backups', 'client-loaders');
const srcClientDir = path.join(rootDir, 'src', 'client');

// Print header
console.log('======================================================');
console.log('Fix Client Loaders Redundancy');
console.log('======================================================\n');

console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'EXECUTION'}\n`);

// Main execution
async function main() {
  try {
    // Create backups directory if it doesn't exist
    ensureDirectoryExists(backupsDir);
    
    // Create src/client directory if it doesn't exist (for adapter files)
    ensureDirectoryExists(srcClientDir);
    
    // Create adapter files in the src/client directory for backward compatibility
    createAdapterFiles();
    
    console.log('\n✅ Client loaders redundancy fix completed successfully.');
  } catch (error) {
    console.error('\n❌ Error fixing client loaders redundancy:', error);
    process.exit(1);
  }
}

/**
 * Create adapter files in the src/client directory for backward compatibility
 */
function createAdapterFiles() {
  console.log('📝 Creating adapter files for backward compatibility...');
  
  // Create index.ts adapter
  const indexContent = `'use client';

/**
 * @deprecated This module is deprecated. Use src/app/_components.tsx and src/app/_client-loader.tsx instead.
 * This adapter is provided for backward compatibility.
 */

export { ClientComponentKey } from '../app/_components';
export { UniversalComponentLoader as default } from '../app/_client-loader';
`;
  
  writeFile(path.join(srcClientDir, 'index.ts'), indexContent);
  
  // Create ClientComponentLoader.tsx adapter
  const loaderContent = `'use client';

/**
 * @deprecated This component is deprecated. Use UniversalComponentLoader from src/app/_client-loader.tsx instead.
 * This adapter is provided for backward compatibility.
 */

import { UniversalComponentLoader } from '../app/_client-loader';

export default UniversalComponentLoader;
`;
  
  writeFile(path.join(srcClientDir, 'ClientComponentLoader.tsx'), loaderContent);
  
  // Create registry.ts adapter
  const registryContent = `'use client';

/**
 * @deprecated This registry is deprecated. Use CLIENT_COMPONENTS from src/app/_components.tsx instead.
 * This adapter is provided for backward compatibility.
 */

import { CLIENT_COMPONENTS, ClientComponentKey } from '../app/_components';

export const clientComponentRegistry = CLIENT_COMPONENTS;
export type { ClientComponentKey };
`;
  
  writeFile(path.join(srcClientDir, 'registry.ts'), registryContent);
}

/**
 * Helper function to ensure a directory exists
 */
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    if (!DRY_RUN) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${path.relative(rootDir, dir)}`);
    } else {
      console.log(`📁 Would create directory: ${path.relative(rootDir, dir)}`);
    }
  }
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
    fs.writeFileSync(filePath, content);
    console.log(`📄 Wrote file: ${relativePath}`);
  }
}

// Run the script
main();

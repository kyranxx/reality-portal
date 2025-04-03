/**
 * Fix Firebase Import Issues
 * 
 * This script creates adapter files for backward compatibility with the new modular
 * Firebase implementation. It helps fix issues with import paths and provides
 * a smoother transition to the new architecture.
 * 
 * Run with: node scripts/fix-firebase-imports.js [--execute]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const DRY_RUN = !process.argv.includes('--execute');

// File paths for adapter files
const adapters = [
  {
    path: path.join(rootDir, 'src', 'utils', 'firestore-adapter.ts'),
    content: `/**
 * Firestore Adapter
 * 
 * @deprecated This adapter is provided for backward compatibility with the old Firebase structure.
 * Please update import paths to use the new modular structure in src/utils/firebase/ directory.
 */

// Re-export from the new modular structure
export * from './firebase/firestore';
// Also export the default export if there was one
import firestore from './firebase/firestore';
export default firestore;
`
  },
  {
    path: path.join(rootDir, 'src', 'utils', 'firebase-auth-adapter.ts'),
    content: `/**
 * Firebase Auth Adapter
 * 
 * @deprecated This adapter is provided for backward compatibility with the old Firebase structure.
 * Please update import paths to use the new modular structure in src/utils/firebase/ directory.
 */

// Re-export from the new modular structure
export * from './firebase/auth';
// Also export the default export if there was one
import auth from './firebase/auth';
export default auth;
`
  },
  {
    path: path.join(rootDir, 'src', 'utils', 'firebase-adapter.ts'),
    content: `/**
 * Firebase Core Adapter
 * 
 * @deprecated This adapter is provided for backward compatibility with the old Firebase structure.
 * Please update import paths to use the new modular structure in src/utils/firebase/ directory.
 */

// Re-export from the new modular structure
export * from './firebase/core';
// Also export the default export if there was one
import firebase from './firebase/core';
export default firebase;
`
  }
];

// Print header
console.log('======================================================');
console.log('Fix Firebase Import Issues');
console.log('======================================================\n');

console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'EXECUTION'}\n`);

// Main execution
async function main() {
  try {
    // Create adapter files
    createAdapterFiles();
    
    console.log('\n✅ Firebase import fixes completed successfully.');
  } catch (error) {
    console.error('\n❌ Error fixing Firebase imports:', error);
    process.exit(1);
  }
}

/**
 * Create adapter files for backward compatibility
 */
function createAdapterFiles() {
  console.log('📝 Creating Firebase adapter files for backward compatibility...');
  
  adapters.forEach(adapter => {
    writeFile(adapter.path, adapter.content);
  });
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

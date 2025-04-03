/**
 * Clean Up Test Redundancies
 * 
 * This script cleans up redundant test files identified in the project:
 * - Redundant line-ending test files
 * - Binary test content files
 * - Duplicate debug HTML files
 * 
 * Run with: node scripts/cleanup-test-redundancies.js [--execute]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const DRY_RUN = !process.argv.includes('--execute');

// File paths
const backupsDir = path.join(rootDir, 'backups', 'test-files');
const testFiles = [
  // Line ending test files (keep line-ending-test.txt, remove the other)
  path.join(rootDir, 'test-line-endings.txt'),
  // Binary test files 
  path.join(rootDir, 'another-test.txt'),
  path.join(rootDir, 'test-warnings.txt'),
  // Debug HTML (keep public/debug-test.html, remove src version)
  path.join(rootDir, 'src', 'debug-test.html')
];

// Print header
console.log('======================================================');
console.log('Clean Up Test Redundancies');
console.log('======================================================\n');

console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'EXECUTION'}\n`);

// Main execution
async function main() {
  try {
    // Create backups directory if it doesn't exist
    ensureDirectoryExists(backupsDir);
    
    // Backup and remove redundant test files
    cleanupTestFiles();
    
    console.log('\n✅ Test redundancies cleanup completed successfully.');
  } catch (error) {
    console.error('\n❌ Error cleaning up test redundancies:', error);
    process.exit(1);
  }
}

/**
 * Backup and remove redundant test files
 */
function cleanupTestFiles() {
  console.log('📝 Processing redundant test files...');
  
  testFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const fileName = path.basename(filePath);
      const backupPath = path.join(backupsDir, fileName);
      
      // Backup file
      if (!DRY_RUN) {
        try {
          // Copy to backup location
          fs.copyFileSync(filePath, backupPath);
          console.log(`📄 Backed up: ${path.relative(rootDir, filePath)} → ${path.relative(rootDir, backupPath)}`);
          
          // Remove original
          fs.unlinkSync(filePath);
          console.log(`🗑️ Removed: ${path.relative(rootDir, filePath)}`);
        } catch (error) {
          console.error(`❌ Error processing ${fileName}:`, error.message);
        }
      } else {
        console.log(`📄 Would backup: ${path.relative(rootDir, filePath)} → ${path.relative(rootDir, backupPath)}`);
        console.log(`🗑️ Would remove: ${path.relative(rootDir, filePath)}`);
      }
    } else {
      console.log(`⚠️ File not found (already processed?): ${path.relative(rootDir, filePath)}`);
    }
  });
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

// Run the script
main();

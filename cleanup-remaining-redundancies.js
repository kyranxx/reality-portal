const fs = require('fs');
const path = require('path');

// Clean up test files
const redundantTestFiles = [
  'test-line-endings.txt',
  'another-test.txt',
  'test-warnings.txt',
  'src/debug-test.html'
];

// Clean up client component redundancies
const clientRedundancies = [
  'src/client/ClientComponentLoader.tsx',
  'src/client/registry.ts', 
  'src/client/index.ts'
];

// Process each file
const allFiles = [...redundantTestFiles, ...clientRedundancies];
let processedCount = 0;

// Create backups directory
const backupDir = path.join(__dirname, 'backups', 'remaining-redundancies');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`Created backup directory: ${backupDir}`);
}

// Process each file
allFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    try {
      // Create backup
      const backupPath = path.join(backupDir, path.basename(file) + '.bak');
      fs.copyFileSync(fullPath, backupPath);
      console.log(`✅ Created backup: ${backupPath}`);
      
      // Remove original file
      fs.unlinkSync(fullPath);
      console.log(`🗑️ Removed redundant file: ${file}`);
      processedCount++;
    } catch (error) {
      console.error(`❌ Error processing ${file}: ${error.message}`);
    }
  } else {
    console.log(`⚠️ File not found: ${file}`);
  }
});

console.log(`\n======================================================`);
console.log(`Cleanup Summary`);
console.log(`======================================================`);
console.log(`Files processed: ${processedCount} of ${allFiles.length}`);
console.log(`Backup location: ${backupDir}`);
console.log(`======================================================`);

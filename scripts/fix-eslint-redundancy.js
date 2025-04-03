    /**
 * Fix ESLint Configuration Redundancy
 * 
 * This script consolidates .eslintrc.js and .eslintrc.json into a single configuration
 * by keeping the .eslintrc.js file and removing the .eslintrc.json file.
 */

const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const eslintJsPath = path.join(rootDir, '.eslintrc.js');
const eslintJsonPath = path.join(rootDir, '.eslintrc.json');
const backupPath = path.join(rootDir, '.eslintrc.json.bak');

console.log('ESLint Configuration Consolidation');
console.log('----------------------------------');

// Check if both files exist
if (!fs.existsSync(eslintJsPath)) {
  console.error('❌ .eslintrc.js not found!');
  process.exit(1);
}

if (!fs.existsSync(eslintJsonPath)) {
  console.log('✅ Only .eslintrc.js exists. No action needed.');
  process.exit(0);
}

// Both files exist, so we need to consolidate
console.log('📊 Both .eslintrc.js and .eslintrc.json exist. Creating backup and removing .eslintrc.json...');

try {
  // Create backup
  fs.copyFileSync(eslintJsonPath, backupPath);
  console.log(`✅ Created backup at ${backupPath}`);
  
  // Remove JSON config
  fs.unlinkSync(eslintJsonPath);
  console.log(`✅ Removed redundant .eslintrc.json`);
  
  console.log('\n✨ ESLint configuration successfully consolidated to .eslintrc.js!');
} catch (error) {
  console.error('❌ Error during consolidation:', error.message);
  process.exit(1);
}

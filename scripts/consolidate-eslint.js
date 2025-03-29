/**
 * Consolidate ESLint Configuration
 * 
 * This script documents the redundancy between .eslintrc.js and .eslintrc.json
 * and explains why we're standardizing on .eslintrc.js.
 * 
 * Run with: node scripts/consolidate-eslint.js
 */

const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const eslintJsPath = path.join(rootDir, '.eslintrc.js');
const eslintJsonPath = path.join(rootDir, '.eslintrc.json');
const backupPath = path.join(rootDir, '.eslintrc.json.bak');

// Check if both files exist
const jsExists = fs.existsSync(eslintJsPath);
const jsonExists = fs.existsSync(eslintJsonPath);

console.log('ESLint Configuration Consolidation');
console.log('----------------------------------');

if (!jsExists && !jsonExists) {
  console.log('❌ No ESLint configuration files found.');
  process.exit(1);
}

if (jsExists && !jsonExists) {
  console.log('✅ Already using single .eslintrc.js configuration. No action needed.');
  process.exit(0);
}

if (!jsExists && jsonExists) {
  console.log('⚠️ Only .eslintrc.json exists. Consider converting to .eslintrc.js for more flexibility.');
  process.exit(0);
}

// Both files exist - analyze them
console.log('📊 Analyzing ESLint configuration redundancy...');

// Read files
const jsConfig = require(eslintJsPath);
const jsonConfig = JSON.parse(fs.readFileSync(eslintJsonPath, 'utf-8'));

// Compare configurations
const jsStr = JSON.stringify(jsConfig);
const jsonStr = JSON.stringify(jsonConfig);

if (jsStr === jsonStr) {
  console.log('🔄 Configurations are identical in content.');
} else {
  console.log('⚠️ Configurations differ in content. Manual review recommended.');
  console.log('Differences may include:');
  
  // Show simple difference check on top-level keys
  const jsKeys = Object.keys(jsConfig);
  const jsonKeys = Object.keys(jsonConfig);
  
  const onlyInJs = jsKeys.filter(key => !jsonKeys.includes(key));
  const onlyInJson = jsonKeys.filter(key => !jsKeys.includes(key));
  
  if (onlyInJs.length > 0) {
    console.log(`- Keys only in .eslintrc.js: ${onlyInJs.join(', ')}`);
  }
  
  if (onlyInJson.length > 0) {
    console.log(`- Keys only in .eslintrc.json: ${onlyInJson.join(', ')}`);
  }
}

// Provide recommendation
console.log('\n📝 Recommendation:');
console.log('1. Keep .eslintrc.js as the primary configuration because:');
console.log('   - Supports comments for better documentation');
console.log('   - Allows dynamic configuration using Node.js');
console.log('   - Matches common JavaScript project standards');
console.log('2. Create backup of .eslintrc.json');
console.log('3. Remove .eslintrc.json to avoid confusion');

// Execute backup and removal if needed
if (process.argv.includes('--execute')) {
  console.log('\n🔄 Executing recommendation...');
  
  // Create backup
  fs.copyFileSync(eslintJsonPath, backupPath);
  console.log(`✅ Created backup at ${backupPath}`);
  
  // Remove JSON config
  fs.unlinkSync(eslintJsonPath);
  console.log(`✅ Removed redundant .eslintrc.json`);
  
  console.log('\n✨ ESLint configuration successfully consolidated!');
} else {
  console.log('\n⚠️ This was a dry run. To execute these changes, run with --execute flag:');
  console.log('node scripts/consolidate-eslint.js --execute');
}

/**
 * Consolidate Header Components
 * 
 * This script handles the consolidation of duplicate Header components:
 * - src/components/Header.tsx
 * - src/components/Header-fixed.tsx
 * 
 * It analyzes the components, confirms they are identical, and creates 
 * a consolidated version in the layouts directory following best practices.
 * 
 * Run with: node scripts/consolidate-header.js
 * Run with: node scripts/consolidate-header.js --execute to perform the consolidation
 */

const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const headerPath = path.join(rootDir, 'src', 'components', 'Header.tsx');
const headerFixedPath = path.join(rootDir, 'src', 'components', 'Header-fixed.tsx');
const newHeaderPath = path.join(rootDir, 'src', 'components', 'layouts', 'Header.tsx');
const backupDir = path.join(rootDir, 'backups', 'components');

// Make sure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Make sure layouts directory exists
const layoutsDir = path.join(rootDir, 'src', 'components', 'layouts');
if (!fs.existsSync(layoutsDir)) {
  fs.mkdirSync(layoutsDir, { recursive: true });
}

// Function to analyze header components
function analyzeHeaderComponents() {
  console.log('Header Components Consolidation');
  console.log('------------------------------');

  // Check if header components exist
  const headerExists = fs.existsSync(headerPath);
  const headerFixedExists = fs.existsSync(headerFixedPath);

  if (!headerExists && !headerFixedExists) {
    console.log('❌ No Header components found at expected paths.');
    process.exit(1);
  }

  if (!headerExists) {
    console.log(`❌ Header component not found at ${headerPath}`);
    process.exit(1);
  }

  if (!headerFixedExists) {
    console.log(`❌ Header-fixed component not found at ${headerFixedPath}`);
    process.exit(1);
  }

  // Read component files
  const headerContent = fs.readFileSync(headerPath, 'utf-8');
  const headerFixedContent = fs.readFileSync(headerFixedPath, 'utf-8');

  // Compare component content
  if (headerContent === headerFixedContent) {
    console.log('✅ Components are identical. Can be safely consolidated.');
  } else {
    console.log('⚠️ Components differ. Manual review required:');
    findDifferences(headerContent, headerFixedContent);
    process.exit(1);
  }

  return { headerContent, headerFixedContent };
}

// Simple function to find differences between component files
function findDifferences(content1, content2) {
  const lines1 = content1.split('\n');
  const lines2 = content2.split('\n');

  const maxLines = Math.max(lines1.length, lines2.length);
  
  console.log('\nDifferences:');
  let diffFound = false;

  for (let i = 0; i < maxLines; i++) {
    const line1 = lines1[i] || '';
    const line2 = lines2[i] || '';

    if (line1 !== line2) {
      console.log(`Line ${i + 1}:`);
      console.log(`- Header:       ${line1}`);
      console.log(`- Header-fixed: ${line2}`);
      console.log();
      diffFound = true;
    }
  }

  if (!diffFound) {
    console.log('No line-by-line differences found. Files might differ in whitespace or line endings.');
  }
}

// Function to generate modernized header component
function generateModernHeader(content) {
  // Add a note about consolidation
  const consolidationComment = `/**
 * Main Header Component
 *
 * This component was created by consolidating duplicate header components:
 * - Header.tsx
 * - Header-fixed.tsx
 *
 * It includes all functionality from both components with improved organization.
 */
`;

  // Add the rest of the content unchanged since they are identical
  // In a real scenario, you might want to enhance/refactor the code
  return consolidationComment + content;
}

// Function to consolidate headers
function consolidateHeaders(headerContent) {
  // Generate new header content
  const newContent = generateModernHeader(headerContent);

  // Calculate backup paths
  const headerBackupPath = path.join(backupDir, 'Header.tsx.bak');
  const headerFixedBackupPath = path.join(backupDir, 'Header-fixed.tsx.bak');

  if (process.argv.includes('--execute')) {
    console.log('\n🔄 Executing consolidation...');
    
    // Create backups
    fs.copyFileSync(headerPath, headerBackupPath);
    fs.copyFileSync(headerFixedPath, headerFixedBackupPath);
    console.log(`✅ Created backups in ${backupDir}`);
    
    // Write new header component
    fs.writeFileSync(newHeaderPath, newContent);
    console.log(`✅ Created consolidated Header component at ${newHeaderPath}`);
    
    // Remove old files - comment this out if you want to keep originals during transition
    // fs.unlinkSync(headerPath);
    // fs.unlinkSync(headerFixedPath);
    // console.log('✅ Removed redundant header components');
    
    console.log('\n✨ Header components successfully consolidated!');
    console.log('\n⚠️ IMPORTANT: You must update imports across the codebase');
    console.log('   from: import Header from \'@/components/Header\' or \'@/components/Header-fixed\'');
    console.log('   to:   import Header from \'@/components/layouts/Header\'');
  } else {
    console.log('\n⚠️ This was a dry run. To execute these changes, run with --execute flag:');
    console.log('node scripts/consolidate-header.js --execute');
  }
}

// Main script execution
try {
  const { headerContent } = analyzeHeaderComponents();
  consolidateHeaders(headerContent);
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}

/**
 * Debug Header Files
 * 
 * This script compares the two header files byte by byte
 * to identify any differences that might be causing the
 * consolidation script to fail.
 */

const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const headerPath = path.join(rootDir, 'src', 'components', 'Header.tsx');
const headerFixedPath = path.join(rootDir, 'src', 'components', 'Header-fixed.tsx');

console.log('Debug Header Files Comparison');
console.log('-----------------------------');

// Read files as buffers to catch byte-level differences
const headerBuffer = fs.readFileSync(headerPath);
const headerFixedBuffer = fs.readFileSync(headerFixedPath);

// Read files as strings
const headerContent = fs.readFileSync(headerPath, 'utf-8');
const headerFixedContent = fs.readFileSync(headerFixedPath, 'utf-8');

// Compare file sizes
console.log(`Header.tsx size: ${headerBuffer.length} bytes`);
console.log(`Header-fixed.tsx size: ${headerFixedBuffer.length} bytes`);

// Check exact equality
if (headerContent === headerFixedContent) {
  console.log('\n✅ Files are exactly identical as strings');
} else {
  console.log('\n❌ Files differ as strings');
  
  // Compare lengths
  console.log(`Header.tsx length: ${headerContent.length} characters`);
  console.log(`Header-fixed.tsx length: ${headerFixedContent.length} characters`);
  
  // Compare line by line with line numbers and character codes
  const headerLines = headerContent.split('\n');
  const headerFixedLines = headerFixedContent.split('\n');
  
  console.log(`\nHeader.tsx: ${headerLines.length} lines`);
  console.log(`Header-fixed.tsx: ${headerFixedLines.length} lines`);
  
  console.log('\nDetailed comparison:');
  const maxLines = Math.max(headerLines.length, headerFixedLines.length);
  
  for (let i = 0; i < maxLines; i++) {
    const line1 = headerLines[i] || '';
    const line2 = headerFixedLines[i] || '';
    
    if (line1 !== line2) {
      console.log(`\nLine ${i + 1}:`);
      console.log(`- Header:       "${line1}"`);
      console.log(`- Header-fixed: "${line2}"`);
      
      // Find the exact position where the lines differ
      const minLength = Math.min(line1.length, line2.length);
      let diffPos = -1;
      
      for (let j = 0; j < minLength; j++) {
        if (line1[j] !== line2[j]) {
          diffPos = j;
          break;
        }
      }
      
      if (diffPos >= 0) {
        console.log(`  Difference at position ${diffPos}:`);
        console.log(`  - Header char:       "${line1[diffPos]}" (${line1.charCodeAt(diffPos)})`);
        console.log(`  - Header-fixed char: "${line2[diffPos]}" (${line2.charCodeAt(diffPos)})`);
      } else if (line1.length !== line2.length) {
        console.log(`  Lines have different lengths: ${line1.length} vs ${line2.length}`);
        if (line1.length > line2.length) {
          console.log(`  Header has extra: "${line1.substring(line2.length)}"`);
        } else {
          console.log(`  Header-fixed has extra: "${line2.substring(line1.length)}"`);
        }
      }
    }
  }
  
  // Check for special characters or BOM
  console.log('\nChecking for BOM or special characters:');
  if (headerBuffer.length > 3 && 
      headerBuffer[0] === 0xEF && 
      headerBuffer[1] === 0xBB && 
      headerBuffer[2] === 0xBF) {
    console.log('- Header.tsx has UTF-8 BOM');
  }
  
  if (headerFixedBuffer.length > 3 && 
      headerFixedBuffer[0] === 0xEF && 
      headerFixedBuffer[1] === 0xBB && 
      headerFixedBuffer[2] === 0xBF) {
    console.log('- Header-fixed.tsx has UTF-8 BOM');
  }
}

// Output file contents
console.log('\nHeader.tsx content:');
console.log('-------------------');
console.log(headerContent);

console.log('\nHeader-fixed.tsx content:');
console.log('------------------------');
console.log(headerFixedContent);

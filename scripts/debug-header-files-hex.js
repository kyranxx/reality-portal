/**
 * Debug Header Files with Hex View
 * 
 * This script shows a hex view of the file contents to debug
 * invisible differences like line endings and trailing characters.
 */

const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const headerPath = path.join(rootDir, 'src', 'components', 'Header.tsx');
const headerFixedPath = path.join(rootDir, 'src', 'components', 'Header-fixed.tsx');

console.log('Debug Header Files with Hex View');
console.log('------------------------------');

// Read files as buffers
const headerBuffer = fs.readFileSync(headerPath);
const headerFixedBuffer = fs.readFileSync(headerFixedPath);

// Function to display buffer in hex with side-by-side ASCII
function displayHexDump(buffer, label) {
  console.log(`\n${label} Hex Dump (${buffer.length} bytes):`);
  console.log('-'.repeat(80));
  console.log('Offset | 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F | ASCII');
  console.log('-'.repeat(80));
  
  for (let i = 0; i < buffer.length; i += 16) {
    // Hex offset
    let line = `${i.toString(16).padStart(6, '0')} | `;
    
    // Hex values
    let ascii = '';
    for (let j = 0; j < 16; j++) {
      if (i + j < buffer.length) {
        const byte = buffer[i + j];
        line += byte.toString(16).padStart(2, '0') + ' ';
        // ASCII side (printable ASCII range is 32-126)
        ascii += byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.';
      } else {
        line += '   '; // 3 spaces for alignment
        ascii += ' ';
      }
    }
    
    // Print the line with ASCII representation
    console.log(`${line}| ${ascii}`);
  }
}

// Compare file sizes
console.log(`Header.tsx size:        ${headerBuffer.length} bytes`);
console.log(`Header-fixed.tsx size:  ${headerFixedBuffer.length} bytes`);

// Display the last 10 bytes of each file in hex to check line endings
console.log(`\nLast 10 bytes of Header.tsx:`);
displayHexDump(headerBuffer.slice(-10), 'Header.tsx (last 10 bytes)');

console.log(`\nLast 10 bytes of Header-fixed.tsx:`);
displayHexDump(headerFixedBuffer.slice(-10), 'Header-fixed.tsx (last 10 bytes)');

// Display the full files in hex if they're small enough
if (headerBuffer.length < 500 && headerFixedBuffer.length < 500) {
  displayHexDump(headerBuffer, 'Header.tsx (full file)');
  displayHexDump(headerFixedBuffer, 'Header-fixed.tsx (full file)');
}

// Fix the trailing new line issue
console.log('\nAttempting to fix files...');

// Read files as strings
const headerContent = fs.readFileSync(headerPath, 'utf-8');
const headerFixedContent = fs.readFileSync(headerFixedPath, 'utf-8');

// Normalize line endings and ensure exactly one trailing newline
const normalizedHeader = headerContent.replace(/\r\n/g, '\n').trim() + '\n';
const normalizedHeaderFixed = headerFixedContent.replace(/\r\n/g, '\n').trim() + '\n';

// Write back the normalized content
fs.writeFileSync(headerPath, normalizedHeader);
fs.writeFileSync(headerFixedPath, normalizedHeaderFixed);

console.log('Files normalized with consistent line endings and exactly one trailing newline.');
console.log('Please run the consolidation script again.');

// Test script to verify that dynamic route parameters are consistent
const fs = require('fs');
const path = require('path');

console.log('Verifying dynamic route parameter consistency...');

const NEHNUTELNOSTI_DIR = path.join(__dirname, 'src', 'app', 'nehnutelnosti');

// Check if [type] directory exists (it should not)
const typeDir = path.join(NEHNUTELNOSTI_DIR, '[type]');
if (fs.existsSync(typeDir)) {
  console.error('ERROR: [type] directory still exists!');
  process.exit(1);
}

// Check if [id] directory exists with _type subdirectory
const idDir = path.join(NEHNUTELNOSTI_DIR, '[id]');
const typeHandlerDir = path.join(idDir, '_type');
if (!fs.existsSync(typeHandlerDir)) {
  console.error('ERROR: [id]/_type directory does not exist!');
  process.exit(1);
}

// Verify page content in [id]/_type/page.tsx
const typeHandlerPath = path.join(typeHandlerDir, 'page.tsx');
const typeHandlerContent = fs.readFileSync(typeHandlerPath, 'utf8');
if (!typeHandlerContent.includes('params: { id: string }')) {
  console.error('ERROR: [id]/_type/page.tsx does not use consistent "id" parameter!');
  process.exit(1);
}

// Verify page content in [id]/page.tsx
const idPagePath = path.join(idDir, 'page.tsx');
const idPageContent = fs.readFileSync(idPagePath, 'utf8');
if (!idPageContent.includes('validPropertyTypes.includes(id)')) {
  console.error('ERROR: [id]/page.tsx does not check for property types!');
  process.exit(1);
}

console.log('✅ All dynamic route parameters are consistent!');
console.log('The fix should resolve the Vercel deployment error.');

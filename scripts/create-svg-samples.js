const fs = require('fs');
const path = require('path');

// Ensure directories exist
const createDirIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const dirs = [
  'public/images/samples/apartments',
  'public/images/samples/houses',
  'public/images/samples/land',
  'public/images/samples/commercial'
];

dirs.forEach(dir => createDirIfNotExists(dir));

// SVG templates
const apartmentSvg = `<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f9fafb"/>
  <rect x="100" y="60" width="200" height="180" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <rect x="130" y="90" width="50" height="50" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
  <rect x="220" y="90" width="50" height="50" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
  <rect x="130" y="160" width="50" height="50" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
  <rect x="220" y="160" width="50" height="50" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
  <text x="200" y="270" font-family="Arial" font-size="14" text-anchor="middle" fill="#666666">Apartment</text>
</svg>`;

const houseSvg = `<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f9fafb"/>
  <polygon points="200,50 100,150 300,150" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <rect x="120" y="150" width="160" height="100" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <rect x="180" y="200" width="40" height="50" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
  <rect x="140" y="170" width="30" height="30" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
  <rect x="230" y="170" width="30" height="30" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
  <text x="200" y="270" font-family="Arial" font-size="14" text-anchor="middle" fill="#666666">House</text>
</svg>`;

const landSvg = `<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f9fafb"/>
  <rect x="50" y="50" width="300" height="200" fill="#f5f5f5" stroke="#000000" stroke-width="2"/>
  <path d="M50,120 Q200,50 350,120" fill="none" stroke="#666666" stroke-width="1"/>
  <path d="M50,180 Q200,240 350,180" fill="none" stroke="#666666" stroke-width="1"/>
  <circle cx="150" cy="150" r="10" fill="#ffffff" stroke="#000000" stroke-width="1"/>
  <circle cx="250" cy="150" r="10" fill="#ffffff" stroke="#000000" stroke-width="1"/>
  <text x="200" y="270" font-family="Arial" font-size="14" text-anchor="middle" fill="#666666">Land</text>
</svg>`;

const commercialSvg = `<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f9fafb"/>
  <rect x="100" y="70" width="200" height="160" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <rect x="120" y="100" width="30" height="30" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
  <rect x="185" y="100" width="30" height="30" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
  <rect x="250" y="100" width="30" height="30" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
  <rect x="120" y="170" width="160" height="30" fill="#f5f5f5" stroke="#000000" stroke-width="1"/>
  <text x="200" y="270" font-family="Arial" font-size="14" text-anchor="middle" fill="#666666">Commercial</text>
</svg>`;

// Write SVG files
const svgFiles = [
  { path: 'public/images/samples/apartments/apartment-1.svg', content: apartmentSvg },
  { path: 'public/images/samples/houses/house-1.svg', content: houseSvg },
  { path: 'public/images/samples/land/land-1.svg', content: landSvg },
  { path: 'public/images/samples/commercial/commercial-1.svg', content: commercialSvg }
];

svgFiles.forEach(file => {
  fs.writeFileSync(file.path, file.content);
  console.log(`Created ${file.path}`);
});

console.log('All SVG sample files created successfully.');

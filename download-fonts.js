/**
 * Font Download Script for Reality Portal
 * Downloads Inter font files to the correct location.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const fontFiles = [
  // Regular (400)
  { name: 'inter-regular.woff2', url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
  { name: 'inter-regular.woff', url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZBhiI2B.woff' },
  
  // Medium (500)
  { name: 'inter-medium.woff2', url: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2' },
  { name: 'inter-medium.woff', url: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff' },
  
  // Semi-Bold (600)
  { name: 'inter-semibold.woff2', url: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2pL7.woff2' },
  { name: 'inter-semibold.woff', url: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2pL7.woff' },
  
  // Bold (700)
  { name: 'inter-bold.woff2', url: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2' },
  { name: 'inter-bold.woff', url: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff' }
];

const fontsDir = path.join(process.cwd(), 'public', 'fonts');

// Make sure font directory exists
if (!fs.existsSync(fontsDir)) {
  console.log('Creating fonts directory...');
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Download files
fontFiles.forEach(font => {
  const filePath = path.join(fontsDir, font.name);
  
  // Skip if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`Font ${font.name} already exists, skipping...`);
    return;
  }
  
  console.log(`Downloading ${font.name}...`);
  
  const file = fs.createWriteStream(filePath);
  
  https.get(font.url, response => {
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${font.name} successfully!`);
    });
  }).on('error', err => {
    fs.unlink(filePath, () => {}); // Delete file if error occurs
    console.error(`Error downloading ${font.name}: ${err.message}`);
  });
});

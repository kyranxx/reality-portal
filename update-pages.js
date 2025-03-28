#!/usr/bin/env node

/**
 * This script updates all page.tsx files to use the new dynamic rendering approach
 * It adds the necessary exports to prevent static rendering during build
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Updating page configurations to prevent static rendering issues...');

// Find all page.tsx files in the app directory
const pageFiles = glob.sync('src/app/**/page.tsx');

// Counter for tracking changes
let updated = 0;

pageFiles.forEach(filePath => {
  // Skip files we don't want to modify
  if (filePath.includes('_app.') || filePath.includes('_document.')) {
    return;
  }

  console.log(`Processing: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if this uses the UniversalComponentLoader
  if (content.includes('UniversalComponentLoader')) {
    // Add dynamic mode exports if they don't exist
    let updatedContent = content;

    // Add dynamic if needed
    if (!content.includes('export const dynamic')) {
      updatedContent = updatedContent.replace(
        /import.*from.*['"].*_client-loader['"];/,
        "$&\n\n// Disable static rendering and force dynamic for Vercel production\nexport const dynamic = 'force-dynamic';\nexport const revalidate = 0;\n\n// Ensure the page is never statically rendered during build\nexport const generateStaticParams = () => {\n  return [];\n};"
      );
    }
    // Already has dynamic export but may be missing the others
    else if (!content.includes('export const revalidate')) {
      updatedContent = updatedContent.replace(
        /export const dynamic.*?;/,
        "export const dynamic = 'force-dynamic';\nexport const revalidate = 0;\n\n// Ensure the page is never statically rendered during build\nexport const generateStaticParams = () => {\n  return [];\n};"
      );
    }

    // Write the updated content if changes were made
    if (updatedContent !== content) {
      fs.writeFileSync(filePath, updatedContent);
      console.log(`  Updated: ${filePath}`);
      updated++;
    } else {
      console.log(`  No changes needed: ${filePath}`);
    }
  } else {
    console.log(`  Skipping (no UniversalComponentLoader): ${filePath}`);
  }
});

console.log(`\nDone! Updated ${updated} files.`);

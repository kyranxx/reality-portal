/**
 * Component Registration Synchronization Script
 * 
 * This script ensures that all components listed in _components.tsx are also
 * properly registered in _client-loader.tsx to prevent build-time TypeScript errors.
 */

const fs = require('fs');
const path = require('path');

// Paths to the component files
const componentsPath = path.join(process.cwd(), 'src', 'app', '_components.tsx');
const clientLoaderPath = path.join(process.cwd(), 'src', 'app', '_client-loader.tsx');

// Read the files
try {
  const componentsContent = fs.readFileSync(componentsPath, 'utf8');
  const clientLoaderContent = fs.readFileSync(clientLoaderPath, 'utf8');

  // Extract component names from CLIENT_COMPONENTS object in _components.tsx
  const clientComponentsMatch = componentsContent.match(/export const CLIENT_COMPONENTS = \{([^}]+)\}/s);
  if (!clientComponentsMatch) {
    console.error('❌ Could not find CLIENT_COMPONENTS in _components.tsx');
    process.exit(1);
  }

  const componentLines = clientComponentsMatch[1].split('\n');
  const componentKeys = componentLines
    .map(line => {
      const match = line.match(/\s*(\w+):/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  console.log(`Found ${componentKeys.length} components in CLIENT_COMPONENTS:`);
  console.log(componentKeys.join(', '));

  // Extract component names from STATIC_COMPONENTS in _client-loader.tsx
  const staticComponentsMatch = clientLoaderContent.match(/const STATIC_COMPONENTS = \{([^}]+)\}/s);
  if (!staticComponentsMatch) {
    console.error('❌ Could not find STATIC_COMPONENTS in _client-loader.tsx');
    process.exit(1);
  }

  const staticComponentLines = staticComponentsMatch[1].split('\n');
  const staticComponentKeys = staticComponentLines
    .map(line => {
      const match = line.match(/\s*(\w+):/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  console.log(`\nFound ${staticComponentKeys.length} components in STATIC_COMPONENTS:`);
  console.log(staticComponentKeys.join(', '));

  // Find missing components
  const missingComponents = componentKeys.filter(key => !staticComponentKeys.includes(key));

  if (missingComponents.length === 0) {
    console.log('\n✅ All components are properly registered in both files!');
  } else {
    console.error(`\n❌ Found ${missingComponents.length} component(s) missing from STATIC_COMPONENTS:`);
    console.error(missingComponents.join(', '));
    console.error('\nPlease add the missing component(s) to STATIC_COMPONENTS in _client-loader.tsx');
    
    // Suggest import statements
    console.log('\nSuggested imports to add:');
    missingComponents.forEach(component => {
      // Find the import line in _components.tsx
      const importRegex = new RegExp(`import ${component}Component from [^;]+;`);
      const importMatch = componentsContent.match(importRegex);
      if (importMatch) {
        console.log(importMatch[0]);
      } else {
        console.log(`// Could not find import for ${component}Component`);
      }
    });
    
    // Suggest component registrations
    console.log('\nSuggested entries to add to STATIC_COMPONENTS:');
    missingComponents.forEach(component => {
      console.log(`  ${component}: ${component}Component,`);
    });
  }

} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

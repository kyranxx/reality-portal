/**
 * Client Component Registration Validator
 * 
 * This script scans the project for client components and validates they're properly registered in _components.tsx.
 * It prevents build failures caused by missing client component registrations.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

const SRC_DIR = path.join(__dirname, '../src');
const APP_DIR = path.join(SRC_DIR, 'app');
const COMPONENTS_FILE = path.join(APP_DIR, '_components.tsx');

async function findClientComponents(dir, results = []) {
  const files = await readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);
    
    if (stats.isDirectory()) {
      // Skip node_modules and other non-source directories
      if (file !== 'node_modules' && file !== '.next' && file !== 'out') {
        await findClientComponents(filePath, results);
      }
    } else if (file.match(/Client\.(tsx|jsx)$/)) {
      // Found a potential client component
      try {
        const content = await readFile(filePath, 'utf8');
        // Check if this is actually a client component
        if (content.includes('use client')) {
          results.push({
            path: filePath,
            name: path.basename(file, path.extname(file)),
            relativePath: path.relative(SRC_DIR, filePath)
          });
        }
      } catch (err) {
        console.error(`Error reading file ${filePath}:`, err);
      }
    }
  }
  
  return results;
}

async function getRegisteredComponents() {
  try {
    const content = await readFile(COMPONENTS_FILE, 'utf8');
    
    // Extract import statements
    const importRegex = /import\s+(\w+)\s+from\s+['"](.+?)['"];/g;
    const imports = [];
    let match;
    
    while (match = importRegex.exec(content)) {
      imports.push({
        variable: match[1],
        path: match[2]
      });
    }
    
    // Extract component registry entries
    const exportRegex = /export const\s+(\w+)\s+=\s+(\w+);/g;
    const exports = [];
    
    while (match = exportRegex.exec(content)) {
      exports.push({
        name: match[1],
        variable: match[2]
      });
    }
    
    // Extract CLIENT_COMPONENTS entries
    const registryRegex = /CLIENT_COMPONENTS\s+=\s+{([^}]+)}/s;
    const registryMatch = registryRegex.exec(content);
    const registry = [];
    
    if (registryMatch) {
      const registryContent = registryMatch[1];
      const entryRegex = /(\w+):\s+(\w+)/g;
      
      while (match = entryRegex.exec(registryContent)) {
        registry.push({
          name: match[1],
          variable: match[2]
        });
      }
    }
    
    return { imports, exports, registry };
  } catch (err) {
    console.error('Error reading components file:', err);
    return { imports: [], exports: [], registry: [] };
  }
}

async function validateClientComponents() {
  const clientComponents = await findClientComponents(APP_DIR);
  const { imports, exports, registry } = await getRegisteredComponents();
  
  console.log(`\n[VALIDATOR] Found ${clientComponents.length} client components in the project.`);
  
  const missingRegistrations = [];
  
  // Check each client component
  for (const component of clientComponents) {
    // Create the expected import path
    const expectedImportPath = './' + path.relative(APP_DIR, component.path)
      .replace(/\\/g, '/') // Convert Windows paths to Unix style
      .replace(/\.[jt]sx?$/, ''); // Remove extension
    
    // Check if it's imported
    const isImported = imports.some(imp => 
      imp.path === expectedImportPath || 
      // Handle relative paths that might be written differently
      imp.path.endsWith('/' + component.name)
    );
    
    // Check if it's exported and registered
    const exportObj = exports.find(exp => exp.name.replace('Component', '') === component.name.replace('Component', ''));
    const isRegistered = registry.some(reg => reg.name.replace('Component', '') === component.name.replace('Component', ''));
    
    if (!isImported || !exportObj || !isRegistered) {
      missingRegistrations.push({
        component,
        issues: {
          import: !isImported,
          export: !exportObj,
          registry: !isRegistered
        }
      });
    }
  }
  
  // Report missing registrations
  if (missingRegistrations.length > 0) {
    console.log('\n[VALIDATOR] ❌ Found client components that are not properly registered:');
    
    missingRegistrations.forEach(missing => {
      console.log(`\n- ${missing.component.name} (${missing.component.relativePath})`);
      
      if (missing.issues.import) {
        console.log('  ✗ Missing import in _components.tsx');
      }
      
      if (missing.issues.export) {
        console.log('  ✗ Missing export in _components.tsx');
      }
      
      if (missing.issues.registry) {
        console.log('  ✗ Missing entry in CLIENT_COMPONENTS registry');
      }
      
      // Suggest fix
      const componentName = missing.component.name;
      const normalizedName = componentName.replace(/Component$/, '');
      const importPath = './' + path.relative(APP_DIR, missing.component.path)
        .replace(/\\/g, '/')
        .replace(/\.[jt]sx?$/, '');
      
      console.log('\n  Suggested fix:');
      console.log(`  // In _components.tsx`);
      console.log(`  import ${componentName} from '${importPath}';`);
      console.log(`  export const ${normalizedName} = ${componentName};`);
      console.log(`  // Add to CLIENT_COMPONENTS:`);
      console.log(`  ${normalizedName}: ${componentName},`);
    });
    
    console.log('\n[VALIDATOR] ❌ Validation failed. Please register the missing components.');
    process.exit(1);
  } else {
    console.log('[VALIDATOR] ✓ All client components are properly registered.');
  }
}

// Run the validation
console.log('[VALIDATOR] Validating client component registrations...');
validateClientComponents().catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});

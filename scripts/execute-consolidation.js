/**
 * Execute Redundancy Consolidation
 * 
 * This script serves as the main entry point for executing the redundancy consolidation plan.
 * It provides a consolidated interface to run all or specific consolidation scripts
 * and tracks the overall progress of the refactoring effort.
 * 
 * Run with: node scripts/execute-consolidation.js
 * Options:
 *   --all             Execute all consolidation scripts
 *   --eslint          Consolidate ESLint configurations
 *   --header          Consolidate Header components
 *   --debug-tools     Consolidate debug tools
 *   --error-boundary  Consolidate error boundaries
 *   --execute         Actually perform the changes (otherwise dry run)
 *   --report          Generate a consolidation report
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define root directory and consolidation scripts
const rootDir = path.resolve(__dirname, '..');
const consolidationScripts = {
  eslint: path.join(__dirname, 'consolidate-eslint.js'),
  header: path.join(__dirname, 'consolidate-header.js'),
  debugTools: path.join(__dirname, 'consolidate-debug-tools.js'),
  // Add more scripts as they are created
};

// Define backup directory
const backupDir = path.join(rootDir, 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Define the phases of consolidation
const phases = [
  {
    name: 'Configuration Consolidation',
    scripts: ['eslint'],
    description: 'Consolidate configuration files to remove duplication',
  },
  {
    name: 'Component Consolidation',
    scripts: ['header'],
    description: 'Merge duplicate components and standardize component organization',
  },
  {
    name: 'Utility Reorganization',
    scripts: ['debugTools'],
    description: 'Create modular utility structure and merge duplicate utilities',
  },
  // Future phases can be added here
];

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  all: args.includes('--all'),
  eslint: args.includes('--eslint'),
  header: args.includes('--header'),
  debugTools: args.includes('--debug-tools'),
  execute: args.includes('--execute'),
  report: args.includes('--report'),
};

// Print header
console.log('======================================================');
console.log('Reality Portal - Redundancy Consolidation Execution');
console.log('======================================================\n');

// If no specific options provided, show help
if (!args.length) {
  printHelp();
  process.exit(0);
}

// Generate consolidation report if requested
if (options.report) {
  generateReport();
  process.exit(0);
}

// Execute consolidation based on options
console.log(`🔍 Executing in ${options.execute ? 'EXECUTION' : 'DRY RUN'} mode\n`);

// Track execution results
const results = {
  success: [],
  failed: [],
  skipped: [],
};

// Execute specific or all scripts
if (options.all) {
  console.log('🚀 Executing all consolidation phases...\n');
  executeAllPhases();
} else {
  // Execute individual scripts based on flags
  if (options.eslint) {
    executeScript('eslint');
  }
  if (options.header) {
    executeScript('header');
  }
  if (options.debugTools) {
    executeScript('debugTools');
  }
}

// Print summary
printSummary();

/**
 * Print help information
 */
function printHelp() {
  console.log('This script executes the redundancy consolidation plan.');
  console.log('\nUsage: node scripts/execute-consolidation.js [options]\n');
  console.log('Options:');
  console.log('  --all             Execute all consolidation scripts');
  console.log('  --eslint          Consolidate ESLint configurations');
  console.log('  --header          Consolidate Header components');
  console.log('  --debug-tools     Consolidate debug tools');
  console.log('  --execute         Actually perform the changes (otherwise dry run)');
  console.log('  --report          Generate a consolidation report\n');
  
  console.log('Examples:');
  console.log('  node scripts/execute-consolidation.js --all');
  console.log('  node scripts/execute-consolidation.js --eslint --execute');
  console.log('  node scripts/execute-consolidation.js --report\n');

  console.log('Available Consolidation Phases:');
  phases.forEach((phase, index) => {
    console.log(`  ${index + 1}. ${phase.name}: ${phase.description}`);
    phase.scripts.forEach(script => {
      console.log(`     - ${script} (--${script.replace(/([A-Z])/g, '-$1').toLowerCase()})`);
    });
  });
}

/**
 * Execute all consolidation phases in order
 */
function executeAllPhases() {
  phases.forEach((phase, index) => {
    console.log(`\n🔷 Phase ${index + 1}: ${phase.name}`);
    console.log(`   ${phase.description}\n`);
    
    phase.scripts.forEach(script => {
      executeScript(script);
    });
  });
}

/**
 * Execute a specific consolidation script
 */
function executeScript(scriptKey) {
  const scriptPath = consolidationScripts[scriptKey];
  
  if (!scriptPath || !fs.existsSync(scriptPath)) {
    console.log(`❌ Consolidation script for ${scriptKey} not found.`);
    results.failed.push(scriptKey);
    return;
  }
  
  try {
    console.log(`▶️ Executing: ${path.basename(scriptPath)}${options.execute ? ' with --execute flag' : ''}`);
    
    // Build the command
    const cmd = `node "${scriptPath}"${options.execute ? ' --execute' : ''}`;
    
    // Execute the script and capture output
    const output = execSync(cmd, { encoding: 'utf8' });
    console.log(output);
    
    results.success.push(scriptKey);
    console.log(`✅ Successfully executed ${scriptKey} consolidation.`);
  } catch (error) {
    console.error(`❌ Failed to execute ${scriptKey} consolidation:`);
    console.error(error.message);
    results.failed.push(scriptKey);
  }
}

/**
 * Generate a comprehensive consolidation report
 */
function generateReport() {
  console.log('Generating Consolidation Report...\n');
  
  // Create a timestamp for the report
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
  
  // Define report path
  const reportPath = path.join(rootDir, `consolidation-report-${timestamp}.md`);
  
  // Generate report content
  let reportContent = `# Reality Portal Redundancy Consolidation Report
Generated: ${now.toISOString()}

## Overview

This report documents the planned redundancy consolidation for the Reality Portal project.
It outlines the identified redundancies and the proposed consolidation steps.

`;

  // Add phases to the report
  reportContent += `## Consolidation Phases\n\n`;
  phases.forEach((phase, index) => {
    reportContent += `### Phase ${index + 1}: ${phase.name}\n\n`;
    reportContent += `${phase.description}\n\n`;
    
    reportContent += `Scripts:\n`;
    phase.scripts.forEach(script => {
      reportContent += `- \`${script}\`: Run with \`node scripts/consolidate-${script.replace(/([A-Z])/g, '-$1').toLowerCase()}.js\`\n`;
    });
    
    reportContent += `\n`;
  });
  
  // Add redundancy analysis
  reportContent += `## Identified Redundancies\n\n`;
  
  // Configuration redundancies
  reportContent += `### Configuration Redundancies\n\n`;
  reportContent += `- **ESLint Configuration**: Duplicate configurations in \`.eslintrc.js\` and \`.eslintrc.json\`\n`;
  reportContent += `- **Build Configuration**: Overlap between \`vercel.json\` and \`next.config.js\`\n\n`;
  
  // Component redundancies
  reportContent += `### Component Redundancies\n\n`;
  reportContent += `- **Header Components**: Identical implementations in \`Header.tsx\` and \`Header-fixed.tsx\`\n`;
  reportContent += `- **Error Boundaries**: Duplicate implementations in two different directories\n\n`;
  
  // Utility redundancies
  reportContent += `### Utility Redundancies\n\n`;
  reportContent += `- **Debug Tools**: Overlapping functionality between \`src/utils/debug-tools.js\` and \`public/utils/debug-tools.js\`\n`;
  reportContent += `- **Firebase Utilities**: Fragmented Firebase-related utilities across multiple files\n\n`;
  
  // Implementation plan
  reportContent += `## Implementation Plan\n\n`;
  reportContent += `For each redundancy, the consolidation follows these steps:\n\n`;
  reportContent += `1. **Analysis**: Identify duplication and assess differences\n`;
  reportContent += `2. **Backup**: Create backups of all files to be modified\n`;
  reportContent += `3. **Consolidation**: Create new standardized versions in the correct locations\n`;
  reportContent += `4. **Transition**: Update imports and add legacy wrappers for backward compatibility\n`;
  reportContent += `5. **Cleanup**: Remove redundant files once all references are updated\n\n`;
  
  // Next steps
  reportContent += `## Next Steps\n\n`;
  reportContent += `1. Review this report and the consolidation plan\n`;
  reportContent += `2. Run consolidation scripts in dry-run mode: \`node scripts/execute-consolidation.js --all\`\n`;
  reportContent += `3. Execute the consolidation: \`node scripts/execute-consolidation.js --all --execute\`\n`;
  reportContent += `4. Update imports across the codebase to reference new file locations\n`;
  reportContent += `5. Remove legacy wrappers and redundant files once transition is complete\n`;
  
  // Write report to file
  fs.writeFileSync(reportPath, reportContent);
  console.log(`✅ Report generated at: ${reportPath}`);
}

/**
 * Print execution summary
 */
function printSummary() {
  console.log('\n======================================================');
  console.log('Consolidation Execution Summary');
  console.log('======================================================\n');
  
  console.log(`Mode: ${options.execute ? 'EXECUTION' : 'DRY RUN'}\n`);
  
  console.log(`✅ Successful: ${results.success.length}`);
  results.success.forEach(script => console.log(`   - ${script}`));
  
  if (results.failed.length > 0) {
    console.log(`\n❌ Failed: ${results.failed.length}`);
    results.failed.forEach(script => console.log(`   - ${script}`));
  }
  
  if (results.skipped.length > 0) {
    console.log(`\n⏭️ Skipped: ${results.skipped.length}`);
    results.skipped.forEach(script => console.log(`   - ${script}`));
  }
  
  console.log('\n======================================================');
  
  if (!options.execute) {
    console.log('\n⚠️ This was a dry run. To execute actual changes, add --execute flag:');
    console.log('node scripts/execute-consolidation.js --all --execute');
  }
}

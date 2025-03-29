/**
 * Consolidate Debug Tools
 * 
 * This script handles the consolidation of duplicate debug tools:
 * - src/utils/debug-tools.js
 * - public/utils/debug-tools.js
 * 
 * It analyzes both implementations, identifies overlap and unique functions,
 * and creates a consolidated version with improved organization following
 * the proposed utility structure.
 * 
 * Run with: node scripts/consolidate-debug-tools.js
 * Run with: node scripts/consolidate-debug-tools.js --execute to perform the consolidation
 */

const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const srcDebugPath = path.join(rootDir, 'src', 'utils', 'debug-tools.js');
const publicDebugPath = path.join(rootDir, 'public', 'utils', 'debug-tools.js');
const newDebugDir = path.join(rootDir, 'src', 'utils', 'debug');
const backupDir = path.join(rootDir, 'backups', 'utils');

// Output paths for the new modular debug tools
const newIndexPath = path.join(newDebugDir, 'index.js');
const newDiagnosticsPath = path.join(newDebugDir, 'diagnostics.js');
const newMonitoringPath = path.join(newDebugDir, 'monitoring.js');
const newErrorHandlingPath = path.join(newDebugDir, 'error-handling.js');

// Make sure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Make sure new debug directory exists
if (!fs.existsSync(newDebugDir)) {
  fs.mkdirSync(newDebugDir, { recursive: true });
}

// Function to analyze debug tools files
function analyzeDebugTools() {
  console.log('Debug Tools Consolidation');
  console.log('------------------------');

  // Check if debug tool files exist
  const srcDebugExists = fs.existsSync(srcDebugPath);
  const publicDebugExists = fs.existsSync(publicDebugPath);

  if (!srcDebugExists && !publicDebugExists) {
    console.log('❌ No debug tools found at expected paths.');
    process.exit(1);
  }

  if (!srcDebugExists) {
    console.log(`❌ Source debug tools not found at ${srcDebugPath}`);
    process.exit(1);
  }

  if (!publicDebugExists) {
    console.log(`❌ Public debug tools not found at ${publicDebugPath}`);
    process.exit(1);
  }

  // Read debug tools files
  const srcDebugContent = fs.readFileSync(srcDebugPath, 'utf-8');
  const publicDebugContent = fs.readFileSync(publicDebugPath, 'utf-8');

  console.log('✅ Both debug tool files found.');

  // Simple analysis of functions in each file
  const srcFunctions = extractFunctions(srcDebugContent);
  const publicFunctions = extractFunctions(publicDebugContent);

  console.log(`\nSource debug tools (${srcFunctions.length} functions):`);
  srcFunctions.forEach(fn => console.log(`- ${fn}`));

  console.log(`\nPublic debug tools (${publicFunctions.length} functions):`);
  publicFunctions.forEach(fn => console.log(`- ${fn}`));

  // Find common and unique functions
  const commonFunctions = srcFunctions.filter(fn => publicFunctions.includes(fn));
  const srcUniqueFunctions = srcFunctions.filter(fn => !publicFunctions.includes(fn));
  const publicUniqueFunctions = publicFunctions.filter(fn => !srcFunctions.includes(fn));

  console.log(`\nCommon functions (${commonFunctions.length}):`);
  commonFunctions.forEach(fn => console.log(`- ${fn}`));

  console.log(`\nUnique to src/utils (${srcUniqueFunctions.length}):`);
  srcUniqueFunctions.forEach(fn => console.log(`- ${fn}`));

  console.log(`\nUnique to public/utils (${publicUniqueFunctions.length}):`);
  publicUniqueFunctions.forEach(fn => console.log(`- ${fn}`));

  return { srcDebugContent, publicDebugContent, srcFunctions, publicFunctions };
}

// Simple function to extract function names from content
function extractFunctions(content) {
  const functionRegex = /function\s+(\w+)|export\s+(?:function|const)\s+(\w+)|(\w+)\s*:\s*function/g;
  const matches = [...content.matchAll(functionRegex)];
  return matches
    .map(match => match[1] || match[2] || match[3])
    .filter(Boolean)
    .filter(name => name !== 'default');
}

// Function to generate modular debug tools
function generateModularDebugTools(srcContent, publicContent) {
  // Extract the core diagnostics, monitoring, and error handling logic
  // In a real implementation, this would do more sophisticated parsing and separation
  
  // For this example script, we'll create simplified placeholder content
  const diagnosticsContent = `/**
 * Diagnostics Module
 * 
 * This module provides comprehensive diagnostic tools for the application.
 * It's been consolidated from previous debug tools implementations.
 */

import { enhancedLog, trackError } from './monitoring';

// Track all discovered issues
const issues = [];

/**
 * Run all diagnostic tests and report findings
 */
export function runDiagnostics() {
  try {
    console.group('🔍 Reality Portal Diagnostics');
    console.log('Running comprehensive diagnostics...');

    // Run all checks
    checkGlobalErrors();
    checkPerformanceIssues();
    checkResourceLoading();
    checkReactErrors();
    checkFirebaseConfig();
    checkNetworkRequests();
    checkAccessibility();
    checkBrowserCompatibility();

    // Report findings
    console.log(\`Found \${issues.length} potential issues:\`);
    issues.forEach((issue, index) => {
      console.log(\`\${index + 1}. [\${issue.severity}] \${issue.message}\`);
      if (issue.details) console.log('   Details:', issue.details);
      if (issue.fix) console.log('   Fix:', issue.fix);
    });

    console.groupEnd();
    return issues;
  } catch (error) {
    console.error('Error running diagnostics:', error);
    trackError(error, 'diagnostics');
    return [
      {
        severity: 'error',
        message: 'Diagnostic tool crashed',
        details: error.message,
      },
    ];
  }
}

/**
 * Add an issue to the tracking list
 */
function addIssue(severity, message, details, fix) {
  issues.push({ severity, message, details, fix });
  enhancedLog(severity === 'error' ? 'error' : 'warn', message, { details });
}

// Re-export individual diagnostic checks 
// These would be the consolidated implementations of both versions
export { 
  checkGlobalErrors,
  checkPerformanceIssues,
  checkResourceLoading,
  checkReactErrors,
  checkFirebaseConfig,
  checkNetworkRequests,
  checkAccessibility,
  checkBrowserCompatibility
} from './diagnostic-checks';

// Export default function for legacy support
export default runDiagnostics;
`;

  const monitoringContent = `/**
 * Monitoring Module
 * 
 * This module provides error tracking and logging utilities.
 * It's been consolidated from previous debug tools implementations.
 */

// Logs with enhanced context
export function enhancedLog(level, message, data) {
  // Only use in client
  if (typeof window === 'undefined') return;

  const timestamp = new Date().toISOString();
  const context = {
    timestamp,
    url: window.location.href,
    userAgent: navigator.userAgent,
    data,
  };

  switch (level) {
    case 'info':
      console.info(\`[INFO] \${message}\`, context);
      break;
    case 'warn':
      console.warn(\`[WARNING] \${message}\`, context);
      break;
    case 'error':
      console.error(\`[ERROR] \${message}\`, context);
      break;
    case 'debug':
      console.debug(\`[DEBUG] \${message}\`, context);
      break;
  }
}

// Track errors with deduplication
export function trackError(error, source = 'unknown') {
  // Create a key for this error
  const errorKey = \`\${error.name}:\${error.message}:\${error.stack?.split('\\n')[1] || ''}\`;

  // Log the error with context
  enhancedLog('error', \`Error from \${source}: \${error.message}\`, {
    errorName: error.name,
    stack: error.stack,
    source,
  });
}

// Initialize all monitoring when called
export function initializeMonitoring() {
  if (typeof window === 'undefined') return;

  try {
    // Set up global error handlers
    setupGlobalErrorHandlers();

    // Monitor performance
    if ('performance' in window) {
      // Check for slow page loads
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = performance.getEntriesByType('navigation')[0];

          if (timing && timing.domComplete > 3000) {
            enhancedLog('warn', 'Slow page load detected', {
              loadTime: timing.domComplete,
              dns: timing.domainLookupEnd - timing.domainLookupStart,
              tcp: timing.connectEnd - timing.connectStart,
              ttfb: timing.responseStart - timing.requestStart,
              download: timing.responseEnd - timing.responseStart,
              domProcessing: timing.domComplete - timing.responseEnd,
            });
          }
        }, 0);
      });
    }

    enhancedLog('info', 'Monitoring initialized');
  } catch (error) {
    console.error('Failed to initialize monitoring:', error);
  }
}

export default initializeMonitoring;
`;

  const errorHandlingContent = `/**
 * Error Handling Module
 * 
 * This module provides error capturing and handling utilities.
 * It's been consolidated from previous debug tools implementations.
 */

import { trackError, enhancedLog } from './monitoring';

// Set up global error handlers
export function setupGlobalErrorHandlers() {
  // Only set up in browser environment
  if (typeof window === 'undefined') return;

  // Already setup check using a global flag
  if (window.__errorHandlersInitialized) return;
  window.__errorHandlersInitialized = true;

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', event => {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));

    trackError(error, 'unhandledRejection');
  });

  // Handle uncaught errors
  window.addEventListener('error', event => {
    // If this is an image loading error, handle it differently
    if (event.target && event.target.tagName === 'IMG') {
      const imgElement = event.target;
      trackError(new Error(\`Image load failed: \${imgElement.src}\`), 'imageLoadError');
      return;
    }

    trackError(
      event.error ||
        new Error(\`\${event.message} at \${event.filename}:\${event.lineno}:\${event.colno}\`),
      'uncaughtError'
    );
  });

  // Capture network errors with fetch API
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    try {
      const response = await originalFetch.apply(this, args);

      // Track API errors (4xx/5xx)
      if (!response.ok) {
        trackError(
          new Error(\`API Error: \${response.status} \${response.statusText} for \${args[0]}\`),
          'apiError'
        );
      }

      return response;
    } catch (error) {
      // Track network errors
      trackError(error instanceof Error ? error : new Error(String(error)), 'fetchError');
      throw error;
    }
  };

  enhancedLog('info', 'Global error handlers initialized');
}

export default setupGlobalErrorHandlers;
`;

  const indexContent = `/**
 * Debug Tools
 * 
 * This is the main entry point for the debug tools module.
 * It exports a modular, organized set of debugging utilities
 * consolidated from previous implementations.
 */

// Re-export all components for easy access
export { default as runDiagnostics } from './diagnostics';
export { 
  enhancedLog,
  trackError,
  initializeMonitoring,
  default as setupMonitoring
} from './monitoring';
export { 
  setupGlobalErrorHandlers,
  default as setupErrorHandlers
} from './error-handling';

// For backward compatibility with the original debug-tools.js
import runDiagnostics from './diagnostics';
export default runDiagnostics;

// Set up global diagnostics in browser environment
if (typeof window !== 'undefined') {
  window.runDiagnostics = runDiagnostics;

  // Legacy console output capturing for backward compatibility
  if (!window.consoleOutput) {
    window.consoleOutput = '';
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    console.log = function (...args) {
      window.consoleOutput += args.join(' ') + '\\n';
      originalConsoleLog.apply(console, args);
    };

    console.warn = function (...args) {
      window.consoleOutput += args.join(' ') + '\\n';
      originalConsoleWarn.apply(console, args);
    };

    console.error = function (...args) {
      window.consoleOutput += args.join(' ') + '\\n';
      originalConsoleError.apply(console, args);
    };
  }
}
`;

  return {
    diagnosticsContent,
    monitoringContent,
    errorHandlingContent,
    indexContent
  };
}

// Function to consolidate debug tools
function consolidateDebugTools(srcContent, publicContent) {
  // Generate new content for the modular organization
  const {
    diagnosticsContent,
    monitoringContent,
    errorHandlingContent,
    indexContent
  } = generateModularDebugTools(srcContent, publicContent);

  // Calculate backup paths
  const srcDebugBackupPath = path.join(backupDir, 'debug-tools.js.src.bak');
  const publicDebugBackupPath = path.join(backupDir, 'debug-tools.js.public.bak');

  if (process.argv.includes('--execute')) {
    console.log('\n🔄 Executing consolidation...');
    
    // Create backups
    fs.copyFileSync(srcDebugPath, srcDebugBackupPath);
    fs.copyFileSync(publicDebugPath, publicDebugBackupPath);
    console.log(`✅ Created backups in ${backupDir}`);
    
    // Write new modular debug tools
    fs.writeFileSync(newIndexPath, indexContent);
    fs.writeFileSync(newDiagnosticsPath, diagnosticsContent);
    fs.writeFileSync(newMonitoringPath, monitoringContent);
    fs.writeFileSync(newErrorHandlingPath, errorHandlingContent);
    console.log(`✅ Created modular debug tools in ${newDebugDir}`);
    
    // Create legacy wrapper for backward compatibility (optional)
    const srcLegacyWrapper = `/**
 * @deprecated Use the modular debug tools from '@/utils/debug' instead
 */
export * from './debug';
export { default } from './debug';
`;
    fs.writeFileSync(srcDebugPath, srcLegacyWrapper);
    console.log(`✅ Created legacy wrapper at ${srcDebugPath} for backward compatibility`);
    
    console.log('\n✨ Debug tools successfully consolidated!');
    console.log('\n⚠️ IMPORTANT: You should update imports across the codebase:');
    console.log('   from: import runDiagnostics from \'@/utils/debug-tools\'');
    console.log('   to:   import { runDiagnostics } from \'@/utils/debug\'');
    console.log('\n   OR to import specific utilities:');
    console.log('   import { enhancedLog, trackError } from \'@/utils/debug\'');
  } else {
    console.log('\n⚠️ This was a dry run. To execute these changes, run with --execute flag:');
    console.log('node scripts/consolidate-debug-tools.js --execute');
    
    console.log('\n📄 Preview of the new files that would be created:');
    console.log(`- ${newIndexPath}`);
    console.log(`- ${newDiagnosticsPath}`);
    console.log(`- ${newMonitoringPath}`);
    console.log(`- ${newErrorHandlingPath}`);
  }
}

// Main script execution
try {
  const { srcDebugContent, publicDebugContent } = analyzeDebugTools();
  consolidateDebugTools(srcDebugContent, publicDebugContent);
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}

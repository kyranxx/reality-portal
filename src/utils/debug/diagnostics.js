/**
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
    console.log(`Found ${issues.length} potential issues:`);
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. [${issue.severity}] ${issue.message}`);
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

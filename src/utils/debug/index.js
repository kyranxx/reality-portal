/**
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
      window.consoleOutput += args.join(' ') + '\n';
      originalConsoleLog.apply(console, args);
    };

    console.warn = function (...args) {
      window.consoleOutput += args.join(' ') + '\n';
      originalConsoleWarn.apply(console, args);
    };

    console.error = function (...args) {
      window.consoleOutput += args.join(' ') + '\n';
      originalConsoleError.apply(console, args);
    };
  }
}

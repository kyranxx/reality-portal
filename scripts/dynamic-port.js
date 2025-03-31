#!/usr/bin/env node

/**
 * Dynamic port script for Next.js development server
 * Tries port 3002 first, then increments if busy
 */

const { spawn } = require('child_process');
const net = require('net');

// Configuration
const BASE_PORT = 3002;
const MAX_PORT = 3010; // Don't try indefinitely
const VALIDATE_ENV = process.argv.includes('--skip-validation') ? false : true;

/**
 * Check if a TCP port is available
 * @param {number} port - Port to check
 * @returns {Promise<boolean>} - True if available, false if in use
 */
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        // For other errors, consider port available
        resolve(true);
      }
    });
    
    server.once('listening', () => {
      // Close the server and resolve with available
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
}

/**
 * Find first available port starting from BASE_PORT
 * @returns {Promise<number>} Available port or -1 if none found
 */
async function findAvailablePort() {
  for (let port = BASE_PORT; port <= MAX_PORT; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
    console.log(`Port ${port} is in use, trying next port...`);
  }
  return -1; // No available ports found
}

/**
 * Run environment validation if needed
 * @returns {Promise<boolean>} True if validation passed or skipped
 */
async function runValidation() {
  if (!VALIDATE_ENV) {
    return true;
  }

  return new Promise((resolve) => {
    const validation = spawn('node', ['scripts/validate-environment.js'], {
      stdio: 'inherit',
      shell: true
    });
    
    validation.on('exit', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        console.error('Environment validation failed');
        resolve(false);
      }
    });
  });
}

/**
 * Main function to start Next.js with dynamic port
 */
async function startWithDynamicPort() {
  console.log('Finding available port for Next.js development server...');
  
  // Run environment validation first
  if (VALIDATE_ENV) {
    const validationPassed = await runValidation();
    if (!validationPassed) {
      process.exit(1);
    }
  }
  
  // Find available port
  const port = await findAvailablePort();
  
  if (port === -1) {
    console.error(`No available ports found between ${BASE_PORT} and ${MAX_PORT}`);
    process.exit(1);
  }
  
  console.log(`Starting Next.js on port ${port}`);
  
  // Add args to pass through to next dev
  const nextArgs = ['dev'];
  if (process.argv.includes('--turbo')) {
    nextArgs.push('--turbo');
  }
  
  nextArgs.push('-p', port.toString());
  
  // Start Next.js with the available port
  const nextProcess = spawn('next', nextArgs, {
    stdio: 'inherit',
    shell: true
  });
  
  // Handle Next.js process events
  nextProcess.on('error', (err) => {
    console.error('Failed to start Next.js:', err);
    process.exit(1);
  });
  
  nextProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Next.js exited with code ${code}`);
    }
    process.exit(code);
  });
  
  // Forward signals to the child process
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      if (!nextProcess.killed) {
        nextProcess.kill(signal);
      }
    });
  });
}

// Run the main function
startWithDynamicPort().catch(err => {
  console.error('Error starting development server:', err);
  process.exit(1);
});

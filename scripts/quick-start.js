#!/usr/bin/env node

/**
 * Quick Start Development Script
 * 
 * This script starts Next.js directly without running validation checks,
 * resulting in faster startup times.
 * 
 * Usage: node scripts/quick-start.js
 */

const { spawn } = require('child_process');
const chalk = require('chalk');

// Performance measurement
const startTime = Date.now();
console.log(chalk.blue(`[${new Date().toISOString()}] Starting quick development server...`));
console.log(chalk.yellow('Performance timing enabled. You will see startup metrics when ready.'));

// Set environment variable to enable Firebase emulators
process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS = 'true';

console.log(chalk.blue('Starting Next.js in development mode (fast)...'));
console.log(chalk.yellow('Firebase emulators are enabled for faster development.'));

// Start Next.js directly using npx to find the local installation
const nextProcess = spawn('npx', ['next', 'dev', '-p', '3002'], { 
  stdio: ['inherit', 'pipe', 'inherit'],
  env: { ...process.env },
  shell: true
});

// Track when the server is ready
let serverReady = false;
nextProcess.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  
  // Look for the "ready" message
  if (output.includes('Ready in') || output.includes('ready - started server')) {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    serverReady = true;
    console.log(chalk.green(`[${new Date().toISOString()}] Server ready in ${duration.toFixed(1)} seconds`));
    
    // Print instruction for the user
    console.log(chalk.cyan('--------------------------------------------------'));
    console.log(chalk.cyan('✅ Development server is running successfully!'));
    console.log(chalk.cyan('🌐 Open http://localhost:3002 in your browser'));
    console.log(chalk.cyan('🛑 Press Ctrl+C to stop the server'));
    console.log(chalk.cyan('--------------------------------------------------'));
  }
});

// Handle process exit
nextProcess.on('close', (code) => {
  console.log(chalk.yellow(`Next.js exited with code ${code}`));
  process.exit(code);
});

// Handle interrupt signal
process.on('SIGINT', () => {
  console.log(chalk.yellow('\nShutting down...'));
  nextProcess.kill();
  process.exit(0);
});

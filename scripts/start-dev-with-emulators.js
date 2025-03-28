#!/usr/bin/env node

/**
 * Development script that starts both Firebase emulators and Next.js development server
 *
 * This script will:
 * 1. Start Firebase emulators for auth, firestore, and storage
 * 2. Wait for emulators to be ready
 * 3. Start Next.js development server
 *
 * Usage: node scripts/start-dev-with-emulators.js
 */

const { spawn } = require('child_process');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

// ANSI colors for terminal output
const GREEN = chalk.green;
const BLUE = chalk.blue;
const YELLOW = chalk.yellow;
const RED = chalk.red;
const CYAN = chalk.cyan;

// Check if the .env.local file exists, create it if it doesn't
const envLocalPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.log(YELLOW('No .env.local file found. Creating one with emulator settings...'));

  // Copy from .env.example if it exists, otherwise create a basic one
  const envExamplePath = path.join(process.cwd(), '.env.example');
  if (fs.existsSync(envExamplePath)) {
    const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
    const withEmulators =
      exampleContent + '\n# Enable Firebase emulators\nNEXT_PUBLIC_USE_FIREBASE_EMULATORS=true\n';
    fs.writeFileSync(envLocalPath, withEmulators);
  } else {
    const basicEnv = `# Basic Firebase config with emulators enabled
NEXT_PUBLIC_FIREBASE_API_KEY=fake-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fake-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fake-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fake-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=000000000000
NEXT_PUBLIC_FIREBASE_APP_ID=1:000000000000:web:0000000000000000000000
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-0000000000

# Enable Firebase emulators
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
`;
    fs.writeFileSync(envLocalPath, basicEnv);
  }

  console.log(GREEN('.env.local file created with emulator settings'));
}

// Check if firebase.json exists
const firebaseConfigPath = path.join(process.cwd(), 'firebase.json');
if (!fs.existsSync(firebaseConfigPath)) {
  console.log(YELLOW('No firebase.json found. Creating a basic configuration...'));

  const basicConfig = {
    emulators: {
      auth: {
        port: 9099,
        host: 'localhost',
      },
      firestore: {
        port: 8080,
        host: 'localhost',
      },
      storage: {
        port: 9199,
        host: 'localhost',
      },
      ui: {
        port: 4000,
        host: 'localhost',
      },
    },
  };

  fs.writeFileSync(firebaseConfigPath, JSON.stringify(basicConfig, null, 2));
  console.log(GREEN('firebase.json created with emulator settings'));
}

// Initialize emulators if not already
console.log(BLUE('Initializing Firebase emulators (if needed)...'));
try {
  spawn('firebase', ['setup:emulators:firestore'], { stdio: 'inherit' });
  spawn('firebase', ['setup:emulators:storage'], { stdio: 'inherit' });
} catch (error) {
  // Silently continue if this fails, as it might not be necessary
}

// Start emulators
console.log(BLUE('Starting Firebase emulators...'));
const emulatorsProcess = spawn(
  'firebase',
  ['emulators:start', '--only', 'auth,firestore,storage'],
  {
    stdio: ['inherit', 'pipe', 'inherit'],
  }
);

// Flag to track if emulators are ready
let emulatorsReady = false;

// Process emulator output to detect when they're ready
emulatorsProcess.stdout.on('data', data => {
  const output = data.toString();
  console.log(CYAN('[Firebase] ') + output.trim());

  // Check if all emulators are running
  if (
    output.includes('All emulators ready') ||
    (output.includes('Auth Emulator') &&
      output.includes('Firestore Emulator') &&
      output.includes('Storage Emulator'))
  ) {
    emulatorsReady = true;
    console.log(GREEN('✓ Firebase emulators are running'));
    console.log(BLUE('Starting Next.js development server...'));

    // Start Next.js in turbo mode
    const nextProcess = spawn('npm', ['run', 'dev:turbo'], {
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: true },
    });

    // Handle Next.js process exit
    nextProcess.on('close', code => {
      console.log(YELLOW(`Next.js process exited with code ${code}`));
      // Kill emulators when Next.js exits
      emulatorsProcess.kill();
      process.exit(code);
    });
  }
});

// Handle emulators exit
emulatorsProcess.on('close', code => {
  if (!emulatorsReady) {
    console.log(RED(`Firebase emulators failed to start (exit code ${code})`));

    // If emulators failed but we haven't started Next.js yet, just start Next.js
    console.log(YELLOW('Starting Next.js without emulators...'));
    spawn('npm', ['run', 'dev:turbo'], {
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: true },
    });
  } else {
    console.log(YELLOW(`Firebase emulators stopped (exit code ${code})`));
  }
});

// Handle interrupt signal
process.on('SIGINT', () => {
  console.log(YELLOW('\nShutting down...'));
  emulatorsProcess.kill();
  process.exit(0);
});

# Port Management in Reality Portal

## Overview

This document explains how the development server port management is set up to prevent `EADDRINUSE: address already in use` errors that happen when port 3002 is already occupied.

## Solutions Implemented

### 1. Automatic Port Killing

The main `dev` script automatically kills any process using port 3002 before starting the development server:

```json
"dev": "npx kill-port 3002 && next dev -p 3002"
```

This works in most cases where a previous development server was not properly shut down.

### 2. Dynamic Port Allocation

For cases where port 3002 cannot be freed (for example, when used by a different application), a dynamic port allocation script has been added:

```json
"dev:dynamic": "node scripts/dynamic-port.js"
```

This script:

- Tries port 3002 first
- If busy, tries ports 3003, 3004, etc. up to 3010
- Runs the environment validation
- Starts Next.js on the first available port
- Supports Turbo mode with the `--turbo` flag

## How to Use

For normal development:

```bash
npm run dev
```

If you experience port conflicts that cannot be resolved by killing processes:

```bash
npm run dev:dynamic
```

For Turbo mode with dynamic port:

```bash
npm run dev:turbo:dynamic
```

## How It Works

The `dynamic-port.js` script:

1. Checks for available ports using TCP socket testing
2. Runs environment validation (if not skipped)
3. Starts Next.js with the first available port
4. Properly handles process signals for clean shutdown

## Troubleshooting

If both solutions fail:

1. Restart your computer to clear all TCP connections
2. Check for any apps that might be using port 3002
3. Run `netstat -ano | findstr :3002` to identify processes using the port

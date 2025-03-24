#!/usr/bin/env node

/**
 * CORS and Resource Loading Validation Script
 * 
 * This script validates that CORS headers and resource loading are configured correctly
 * before deployment. It checks for common issues that can cause errors in production.
 * 
 * Usage: node scripts/validate-cors.js
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

// Logger utility
const log = {
  info: (msg) => console.log(chalk.blue('ℹ ') + msg),
  success: (msg) => console.log(chalk.green('✅ ') + msg),
  warning: (msg) => console.log(chalk.yellow('⚠️ ') + msg),
  error: (msg) => console.log(chalk.red('❌ ') + msg),
  title: (msg) => console.log('\n' + chalk.bold.underline(msg)),
};

// Check if middleware is configured correctly
const validateMiddleware = () => {
  log.title('Middleware Validation');
  
  const middlewarePath = path.resolve('middleware.ts');
  
  if (!fs.existsSync(middlewarePath)) {
    log.error('middleware.ts not found. Middleware is essential for proper CORS handling.');
    return false;
  }
  
  const middleware = fs.readFileSync(middlewarePath, 'utf8');
  
  // Check for key CORS headers
  const hasCorsHeaders = middleware.includes('Access-Control-Allow-Origin');
  if (!hasCorsHeaders) {
    log.error('CORS headers are not set in middleware.ts');
    return false;
  }
  
  // Check for cache headers for static assets
  const hasCacheHeaders = middleware.includes('Cache-Control');
  if (!hasCacheHeaders) {
    log.warning('Cache Control headers may not be set correctly in middleware');
  }
  
  // Check for environment detection
  const hasEnvDetection = middleware.includes('isVercelEnv') || middleware.includes('process.env.VERCEL');
  if (!hasEnvDetection) {
    log.warning('Middleware may not be correctly detecting Vercel environment');
  }
  
  log.success('Middleware appears to be correctly configured for CORS handling');
  return true;
};

// Check Vercel configuration
const validateVercelConfig = () => {
  log.title('Vercel Configuration Validation');
  
  const vercelConfigPath = path.resolve('vercel.json');
  
  if (!fs.existsSync(vercelConfigPath)) {
    log.warning('vercel.json not found. This file is recommended for proper Vercel configuration.');
    return false;
  }
  
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    
    // Check for headers configuration
    if (!vercelConfig.headers) {
      log.error('No headers configuration found in vercel.json');
      return false;
    }
    
    // Check for CORS headers
    const hasCorsSetting = vercelConfig.headers.some(h => 
      h.headers && h.headers.some(header => 
        header.key === 'Access-Control-Allow-Origin'
      )
    );
    
    if (!hasCorsSetting) {
      log.error('CORS headers not properly configured in vercel.json');
      return false;
    }
    
    // Check for cache headers
    const hasCacheSetting = vercelConfig.headers.some(h => 
      h.headers && h.headers.some(header => 
        header.key === 'Cache-Control'
      )
    );
    
    if (!hasCacheSetting) {
      log.warning('Cache-Control headers not found in vercel.json');
    }
    
    log.success('Vercel configuration appears valid for CORS and resource handling');
    return true;
  } catch (error) {
    log.error(`Error parsing vercel.json: ${error.message}`);
    return false;
  }
};

// Check Next.js configuration
const validateNextConfig = () => {
  log.title('Next.js Configuration Validation');
  
  const nextConfigPath = path.resolve('next.config.js');
  
  if (!fs.existsSync(nextConfigPath)) {
    log.error('next.config.js not found');
    return false;
  }
  
  const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Check for asset prefix configuration
  const hasAssetPrefix = nextConfig.includes('assetPrefix');
  if (!hasAssetPrefix) {
    log.warning('assetPrefix not configured in next.config.js');
  }
  
  // Check for headers function
  const hasHeadersFunction = nextConfig.includes('async headers()');
  if (!hasHeadersFunction) {
    log.warning('Headers function not found in next.config.js');
  }
  
  // Check for image configuration
  const hasImageConfig = nextConfig.includes('images:') && 
                          (nextConfig.includes('domains:') || 
                           nextConfig.includes('remotePatterns:'));
  
  if (!hasImageConfig) {
    log.error('Image optimization not properly configured in next.config.js');
    return false;
  }
  
  // Check for vercel.app domains in image config
  const hasVercelDomains = nextConfig.includes('vercel.app');
  if (!hasVercelDomains) {
    log.warning('Vercel domains may not be properly configured for images');
  }
  
  log.success('Next.js configuration appears valid for CORS and resource handling');
  return true;
};

// Check for font loader configuration
const validateFontLoading = () => {
  log.title('Font Loading Strategy Validation');
  
  // Check for self-hosted fonts directory
  const fontsDirPath = path.resolve('public/fonts');
  if (!fs.existsSync(fontsDirPath)) {
    log.warning('No fonts directory found in public folder. Self-hosted fonts are recommended.');
  } else {
    // Check if fonts directory has any files
    const fontFiles = fs.readdirSync(fontsDirPath);
    if (fontFiles.length === 0) {
      log.warning('Fonts directory exists but contains no font files.');
    } else {
      log.success(`Found ${fontFiles.length} font files in public/fonts directory`);
    }
  }
  
  // Check for font loader CSS
  const fontLoaderPath = path.resolve('src/app/font-loader.css');
  if (!fs.existsSync(fontLoaderPath)) {
    log.warning('No font-loader.css found. This is recommended for proper font loading.');
  } else {
    log.success('Font loader CSS found');
  }
  
  // Check for font preloading in layout
  const layoutPath = path.resolve('src/app/layout.tsx');
  if (fs.existsSync(layoutPath)) {
    const layout = fs.readFileSync(layoutPath, 'utf8');
    const hasPreload = layout.includes('rel="preload"') && layout.includes('as="font"');
    
    if (!hasPreload) {
      log.warning('Font preloading not found in layout.tsx');
    } else {
      log.success('Font preloading configured in layout.tsx');
    }
  }
  
  return true;
};

// Check for environment utility
const validateEnvironmentUtility = () => {
  log.title('Environment Utility Validation');
  
  const environmentPath = path.resolve('src/utils/environment.ts');
  
  if (!fs.existsSync(environmentPath)) {
    log.warning('environment.ts utility not found. This is recommended for environment-aware asset loading.');
    return false;
  }
  
  const environment = fs.readFileSync(environmentPath, 'utf8');
  
  // Check for environment detection
  const hasEnvDetection = environment.includes('isVercel') && environment.includes('isPreviewDeployment');
  if (!hasEnvDetection) {
    log.warning('Environment utility may not correctly detect Vercel environments');
  }
  
  // Check for asset URL utilities
  const hasAssetUrls = environment.includes('getAssetUrl') || environment.includes('getPublicAssetUrl');
  if (!hasAssetUrls) {
    log.warning('Asset URL utilities not found in environment.ts');
  }
  
  log.success('Environment utility appears to be configured correctly');
  return true;
};

// Main validation function
const validateCors = () => {
  log.title('CORS and Resource Loading Validation');
  
  let hasWarnings = false;
  let hasErrors = false;
  
  // Run validations
  if (!validateMiddleware()) hasErrors = true;
  if (!validateVercelConfig()) hasWarnings = true;
  if (!validateNextConfig()) hasErrors = true;
  if (!validateFontLoading()) hasWarnings = true;
  if (!validateEnvironmentUtility()) hasWarnings = true;
  
  // Final report
  log.title('Validation Summary');
  
  if (hasErrors) {
    log.error('Validation found critical issues that must be fixed before deployment');
    return false;
  } else if (hasWarnings) {
    log.warning('Validation passed with warnings. Review them before deploying.');
    return true;
  } else {
    log.success('All validations passed successfully!');
    return true;
  }
};

// Run the validation
try {
  const success = validateCors();
  process.exit(success ? 0 : 1);
} catch (error) {
  log.error(`Validation script error: ${error.message}`);
  process.exit(1);
}

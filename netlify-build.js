#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Netlify build process...');

// Set production environment
process.env.NODE_ENV = 'production';

try {
  // Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
  }
  if (fs.existsSync('out')) {
    execSync('rm -rf out', { stdio: 'inherit' });
  }

  // Type check
  console.log('🔍 Type checking...');
  execSync('npm run type-check', { stdio: 'inherit' });

  // Build the application
  console.log('🏗️ Building Next.js application...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
  
  // Verify build output
  if (fs.existsSync('out')) {
    const files = fs.readdirSync('out');
    console.log(`📁 Build output contains ${files.length} files/directories`);
  } else {
    throw new Error('Build output directory not found');
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

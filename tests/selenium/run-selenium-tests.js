#!/usr/bin/env node

/**
 * Selenium Test Runner for Legacy Browsers
 * Usage: npm run test:selenium
 */

import { runCriticalPathTests } from './critical-path.test.js';

const BROWSERS = process.env.SELENIUM_BROWSER ? [process.env.SELENIUM_BROWSER] : ['chrome'];

async function main() {
  console.log('🚀 Starting Selenium Tests for Legacy Browser Compatibility\n');
  console.log('📋 Test Suite: Critical Path Tests (P0 Priority)');
  console.log(`🌐 Browsers: ${BROWSERS.join(', ')}`);
  console.log('⚠️  Note: Ensure dev server is running on http://localhost:5173\n');
  
  let allPassed = true;
  const results = [];

  for (const browser of BROWSERS) {
    try {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`🌐 Testing with: ${browser.toUpperCase()}`);
      console.log('='.repeat(50));
      
      const result = await runCriticalPathTests(browser);
      results.push({ browser, result });
      
      if (result.failed > 0) {
        allPassed = false;
      }
    } catch (error) {
      console.error(`\n❌ Failed to run tests for ${browser}:`, error.message);
      allPassed = false;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 OVERALL SUMMARY');
  console.log('='.repeat(50));
  
  results.forEach(({ browser, result }) => {
    const status = result.failed === 0 ? '✅' : '❌';
    console.log(`${status} ${browser}: ${result.passed} passed, ${result.failed} failed`);
  });
  
  console.log('='.repeat(50) + '\n');

  if (allPassed) {
    console.log('✅ All tests passed!\n');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Please review the output above.\n');
    process.exit(1);
  }
}

// Check if dev server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:5173');
    return response.ok;
  } catch {
    return false;
  }
}

(async () => {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.error('❌ Dev server is not running!');
    console.error('   Please start the server first: npm run dev\n');
    process.exit(1);
  }
  
  await main();
})();


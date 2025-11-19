// Global test setup for coverage collection
import { test as base } from '@playwright/test';
import { collectCoverage } from './coverage-helper.js';

// Override the test function to automatically collect coverage
export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await use(page);
    
    // Collect coverage after each test
    try {
      await collectCoverage(page, testInfo);
    } catch (error) {
      // Silently fail if coverage collection fails (e.g., if window.__coverage__ doesn't exist)
      if (error.message && !error.message.includes('__coverage__')) {
        console.warn(`Coverage collection warning for test "${testInfo.title}":`, error.message);
      }
    }
  },
});

export { expect } from '@playwright/test';


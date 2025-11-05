// Helper to collect code coverage from Playwright tests
import fs from 'fs';
import path from 'path';

export async function saveCoverage(page, testName) {
  const coverage = await page.evaluate(() => window.__coverage__);
  
  if (coverage) {
    const coverageDir = path.join(process.cwd(), '.nyc_output');
    
    if (!fs.existsSync(coverageDir)) {
      fs.mkdirSync(coverageDir, { recursive: true });
    }
    
    const fileName = `coverage-${testName.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.json`;
    const filePath = path.join(coverageDir, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(coverage));
  }
}

export async function setupCoverageCollection(page) {
  await page.coverage.startJSCoverage();
}

export async function collectCoverage(page, testInfo) {
  // Collect coverage from window.__coverage__ (Istanbul)
  const coverage = await page.evaluate(() => window.__coverage__);
  
  if (coverage) {
    const coverageDir = path.join(process.cwd(), '.nyc_output');
    
    if (!fs.existsSync(coverageDir)) {
      fs.mkdirSync(coverageDir, { recursive: true });
    }
    
    const testName = testInfo.title.replace(/[^a-z0-9]/gi, '-');
    const fileName = `coverage-${testName}-${Date.now()}.json`;
    const filePath = path.join(coverageDir, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(coverage));
  }
}


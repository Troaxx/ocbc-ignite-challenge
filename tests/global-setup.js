// Global setup for Playwright tests
import fs from 'fs';
import path from 'path';

export default function globalSetup() {
  // Clean up previous coverage data
  const coverageDir = path.join(process.cwd(), '.nyc_output');
  const coverageReportDir = path.join(process.cwd(), 'coverage');
  
  if (fs.existsSync(coverageDir)) {
    fs.rmSync(coverageDir, { recursive: true, force: true });
  }
  
  if (fs.existsSync(coverageReportDir)) {
    fs.rmSync(coverageReportDir, { recursive: true, force: true });
  }
  
  // Create fresh directories
  fs.mkdirSync(coverageDir, { recursive: true });
  
  console.log('✅ Coverage directories initialized');
}


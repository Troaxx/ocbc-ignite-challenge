// Global teardown for Playwright tests
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export default function globalTeardown() {
  const coverageDir = path.join(process.cwd(), '.nyc_output');
  
  // Check if coverage data was collected
  if (fs.existsSync(coverageDir)) {
    const files = fs.readdirSync(coverageDir);
    
    if (files.length > 0) {
      console.log(`\n📊 Generating coverage report from ${files.length} test files...`);
      
      try {
        // Generate coverage report using nyc
        execSync('npx nyc report --reporter=html --reporter=text --reporter=lcov', {
          stdio: 'inherit'
        });
        
        console.log('\n✅ Coverage report generated!');
        console.log('📁 HTML report: coverage/index.html');
        console.log('📄 LCOV report: coverage/lcov.info\n');
      } catch (error) {
        console.error('❌ Error generating coverage report:', error.message);
      }
    } else {
      console.log('\n⚠️  No coverage data collected');
    }
  }
}


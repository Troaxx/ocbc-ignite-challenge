import { execSync } from 'child_process';

const isCI = !!process.env.CI;
const checkCoverageFlag = isCI ? '--check-coverage=false' : '';

const command = `npx nyc report --reporter=html --reporter=text --reporter=lcov ${checkCoverageFlag}`.trim();

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}


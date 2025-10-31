# Code Coverage Setup Guide

## Overview
This project now includes code coverage reporting for Playwright E2E tests using Istanbul/NYC.

## Installation

Install the required dependencies:

```bash
npm install --save-dev vite-plugin-istanbul nyc @istanbuljs/nyc-config-typescript
```

## How It Works

1. **Instrumentation**: `vite-plugin-istanbul` instruments your source code during development build
2. **Collection**: Tests run and collect coverage data in `window.__coverage__`
3. **Storage**: Coverage data is saved to `.nyc_output/` directory
4. **Reporting**: NYC generates HTML, LCOV, and text reports in `coverage/` directory

## Running Tests with Coverage

### Basic Usage

```bash
# Run tests and generate coverage
npm run test:coverage

# Or run separately
npm test                  # Run tests (collects coverage)
npm run coverage:report   # Generate report
```

### View Coverage Report

```bash
# Open HTML report in browser
npm run coverage:view

# Or manually
open coverage/index.html  # Mac
start coverage/index.html # Windows
```

### Run Specific Browser with Coverage

```bash
npm run test:chromium
npm run coverage:report
```

## Coverage Output

### Console Output
```
------------------------|---------|----------|---------|---------|
File                    | % Stmts | % Branch | % Funcs | % Lines |
------------------------|---------|----------|---------|---------|
All files              |   84.5  |   72.3   |   88.1  |   83.9  |
 components/           |   92.1  |   85.4   |   95.2  |   91.8  |
  Login/              |   95.5  |   88.9   |   100   |   95.2  |
  ClientManage/       |   88.7  |   82.0   |   90.4  |   88.3  |
 pages/               |   78.3  |   65.2   |   81.5  |   77.9  |
 utils/               |   73.5  |   60.8   |   75.3  |   72.1  |
------------------------|---------|----------|---------|---------|
```

### HTML Report
- Interactive report showing which lines are covered
- Green = covered, Red = not covered
- Click through files to see detailed coverage

### LCOV Report
- Machine-readable format for CI/CD integration
- Used by tools like Codecov, Coveralls, SonarQube

## Coverage Thresholds

Configured in `.nycrc.json`:
- **Statements**: 80%
- **Branches**: 70%
- **Functions**: 80%
- **Lines**: 80%

Tests will fail if coverage drops below these thresholds.

## File Structure

```
project/
├── .nyc_output/              # Raw coverage data
├── coverage/                 # Generated reports
│   ├── index.html           # Main HTML report
│   ├── lcov.info            # LCOV format
│   └── coverage-summary.json
├── .nycrc.json              # NYC configuration
├── tests/
│   ├── global-setup.js      # Cleanup before tests
│   ├── global-teardown.js   # Generate reports after tests
│   └── coverage-helper.js   # Coverage collection utilities
└── vite.config.js           # Istanbul plugin config
```

## What Gets Covered

✅ **Included:**
- All `.js` and `.jsx` files in `src/`
- Components, pages, utilities, contexts
- Business logic and UI interactions

❌ **Excluded:**
- Test files (`*.spec.js`, `*.test.js`)
- Node modules
- Configuration files
- Coverage output directories

## Improving Coverage

### Find Uncovered Code

1. Open `coverage/index.html`
2. Look for red-highlighted lines
3. Write tests to cover those scenarios

### Common Uncovered Areas

- **Error Handlers**: Try/catch blocks
- **Edge Cases**: Rare conditions
- **Validation**: Input validation logic
- **Conditional Branches**: If/else paths

### Example

If this is uncovered:
```javascript
if (balance < amount) {
  throw new Error('Insufficient funds'); // ❌ Not covered
}
```

Add a test:
```javascript
test('TC-XXX: Insufficient balance error', async ({ page }) => {
  await performWithdraw(page, 999999);
  await expect(page.locator('.error')).toContainText('Insufficient');
});
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run tests with coverage
  run: npm run test:coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
    flags: e2e-tests
```

### Coverage Badge

Add to README.md:
```markdown
![Coverage](https://img.shields.io/codecov/c/github/username/repo)
```

## Troubleshooting

### No coverage data collected
**Solution**: Ensure dev server is running with instrumentation:
```bash
# Start dev server
npm run dev

# In another terminal
npm test
```

### Coverage report is empty
**Solution**: Check if `.nyc_output/` has JSON files. If not:
1. Check vite.config.js has Istanbul plugin
2. Verify `window.__coverage__` exists in browser console
3. Check console for instrumentation errors

### Tests pass but no coverage
**Solution**: Make sure global teardown runs:
```bash
# Check playwright.config.js has:
globalTeardown: './tests/global-teardown.js'
```

### Coverage below threshold
**Solution**: 
1. Check which files/lines are uncovered
2. Add tests for uncovered scenarios
3. Or adjust thresholds in `.nycrc.json` (not recommended)

## Best Practices

1. ✅ **Aim for 80%+ coverage** on critical paths
2. ✅ **Test business logic thoroughly** (transactions, validation)
3. ✅ **Cover error scenarios** (edge cases, failures)
4. ✅ **Review coverage reports** regularly
5. ✅ **Don't obsess over 100%** - focus on meaningful tests
6. ❌ **Don't write tests just for coverage** - write meaningful tests

## Coverage vs Quality

Remember:
- **High coverage ≠ good tests**
- **100% coverage ≠ bug-free code**
- Focus on testing **behavior**, not just **lines**

Example:
```javascript
// ❌ Bad: 100% coverage, poor test
test('button exists', async ({ page }) => {
  expect(await page.locator('button').count()).toBeGreaterThan(0);
});

// ✅ Good: Tests actual behavior
test('login button submits form', async ({ page }) => {
  await page.fill('input[type="email"]', 'user@test.com');
  await page.fill('input[type="password"]', 'pass123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

## Current Coverage Status

Run `npm run test:coverage` to see your current coverage!

Target: **80%+ for P0/P1 features**

---

For more information, see:
- [Istanbul Documentation](https://istanbul.js.org/)
- [NYC Documentation](https://github.com/istanbuljs/nyc)
- [Playwright Testing Guide](./TESTING_GUIDE.md)


# Code Coverage 0% Issue Investigation

## Problem
The CI/CD dashboard shows 0% code coverage because the coverage data file doesn't exist.

## Root Cause
The coverage system requires several steps to generate coverage data:

1. **Coverage Collection**: Tests need to run with the dev server that has Istanbul instrumentation enabled
2. **Data Storage**: Coverage data is collected in `window.__coverage__` and saved to `.nyc_output/` directory
3. **Report Generation**: After tests complete, `nyc report` generates the `coverage/lcov.info` file
4. **File Serving**: The Vite dev server serves the `coverage/lcov.info` file at `/coverage/lcov.info`

**Current Status:**
- ❌ `.nyc_output/` directory doesn't exist (no coverage data collected)
- ❌ `coverage/` directory doesn't exist (no coverage report generated)
- ❌ `/coverage/lcov.info` file doesn't exist (can't be fetched by the dashboard)

## Solution

### Option 1: Generate Coverage (Recommended)
Run tests with coverage collection and generate the report:

```bash
# Step 1: Start dev server (in one terminal)
npm run dev

# Step 2: Run tests (in another terminal)
npm test

# Step 3: Generate coverage report
npm run coverage:report
```

Or use the combined command:
```bash
npm run test:coverage
```

This will:
1. Run tests with coverage collection
2. Generate the coverage report in `coverage/` directory
3. Create `coverage/lcov.info` file that the dashboard can read

### Option 2: Check Test Configuration
Verify that tests are actually collecting coverage:

1. **Check if Istanbul plugin is active**: The `vite.config.js` should have `vite-plugin-istanbul` configured
2. **Check if tests use coverage helper**: Tests should call `collectCoverage()` from `tests/coverage-helper.js`
3. **Check browser console**: During test runs, `window.__coverage__` should exist

### Option 3: Manual Verification
Check if coverage is being collected:

```bash
# Check if coverage data exists
ls .nyc_output/

# If files exist, generate report
npm run coverage:report

# Check if report was generated
ls coverage/
```

## How Coverage Works

1. **During Development**: 
   - `vite-plugin-istanbul` instruments source code
   - Instrumented code exposes `window.__coverage__` object

2. **During Tests**:
   - Playwright tests run against the instrumented app
   - Coverage data is collected from `window.__coverage__`
   - Data is saved to `.nyc_output/` as JSON files

3. **After Tests**:
   - `global-teardown.js` runs `nyc report`
   - NYC generates HTML, text, and LCOV reports
   - LCOV report is saved to `coverage/lcov.info`

4. **In Dashboard**:
   - `coverageService.js` fetches `/coverage/lcov.info`
   - Parses LCOV format to extract coverage percentages
   - Displays in dashboard

## Improved Error Handling

The coverage service has been updated to:
- ✅ Log warnings when coverage file is missing
- ✅ Provide helpful instructions on how to generate coverage
- ✅ Detect empty coverage files
- ✅ Warn when coverage is 0% (may indicate no data collected)

## Next Steps

1. **Generate Coverage**: Run `npm run test:coverage` to generate coverage data
2. **Verify File**: Check that `coverage/lcov.info` exists
3. **Refresh Dashboard**: The dashboard should now show coverage percentages
4. **Check Console**: Look for any warnings in browser console about coverage

## Troubleshooting

### Issue: Coverage still shows 0% after generating report
**Solution**: 
- Check browser console for errors
- Verify `coverage/lcov.info` file exists and has content
- Check that Vite dev server is serving the coverage directory
- Verify the file path in browser: `http://localhost:5173/coverage/lcov.info`

### Issue: Tests don't collect coverage
**Solution**:
- Ensure dev server is running with Istanbul plugin
- Check that `window.__coverage__` exists in browser console during tests
- Verify tests are calling `collectCoverage()` helper
- Check that `.nyc_output/` directory is created during test runs

### Issue: Coverage report is empty
**Solution**:
- Check that `.nyc_output/` has JSON files
- Verify NYC is installed: `npm list nyc`
- Check NYC configuration in `.nycrc.json` (if exists)
- Try running `npx nyc report` manually

## Files Involved

- `src/services/coverageService.js` - Fetches and parses coverage data
- `src/services/testResultsService.js` - Integrates coverage with test results
- `vite.config.js` - Configures Istanbul plugin and coverage serving
- `tests/coverage-helper.js` - Helper functions to collect coverage
- `tests/global-teardown.js` - Generates coverage report after tests
- `playwright.config.js` - Test configuration with global setup/teardown


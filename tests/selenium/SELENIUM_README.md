# Selenium Tests for Legacy Browser Compatibility

## Overview
These Selenium tests focus on critical path testing for legacy browser compatibility. Unlike Playwright tests which cover comprehensive functionality, Selenium tests ensure core features work on older browsers.

## Purpose
- Test compatibility with IE11 and older browser versions
- Verify critical user paths work across all browsers
- Smoke testing for legacy environments
- Complement Playwright tests with broader browser coverage

## Setup

### Prerequisites
1. Install ChromeDriver (for Chrome):
```bash
npm install -g chromedriver
```

2. Install GeckoDriver (for Firefox):
```bash
npm install -g geckodriver
```

3. For IE11 (Windows only):
- Download IEDriverServer from Selenium website
- Add to PATH

### Verify Installation
```bash
chromedriver --version
geckodriver --version
```

## Running Tests

### Basic Usage
```bash
# Make sure dev server is running first
npm run dev

# In another terminal, run Selenium tests
npm run test:selenium
```

### Run with Specific Browser
```bash
# Chrome (default)
SELENIUM_BROWSER=chrome npm run test:selenium

# Firefox
SELENIUM_BROWSER=firefox npm run test:selenium
```

## Test Coverage

### Critical Path Tests (P0)
These tests cover essential functionality that must work in all browsers:

1. **TC-001: Authentication**
   - Login with valid credentials
   - Redirect to home page
   - Session management

2. **TC-005: Protected Routes**
   - Unauthorized access redirects to login
   - Route protection works correctly

3. **TC-013: Load Clients**
   - Client list displays correctly
   - Data loads from localStorage
   - Client cards render properly

4. **TC-026: Add Client**
   - Form submission works
   - Client is saved to database
   - Redirect to client list

5. **TC-008: Navigation**
   - Links work correctly
   - URL routing functions
   - Page transitions smooth

6. **TC-051: Page Rendering**
   - Content displays properly
   - CSS loads correctly
   - Layout is functional

7. **TC-014: Search**
   - Search input works
   - Results filter correctly
   - UI updates appropriately

## Test Results

Expected output:
```
==================================================
📊 TEST RESULTS
==================================================
✅ Passed: 7
❌ Failed: 0
📈 Total: 7
==================================================
```

## Differences from Playwright Tests

| Aspect | Playwright | Selenium |
|--------|-----------|----------|
| **Coverage** | Comprehensive (57+ tests) | Critical Path (7 tests) |
| **Browsers** | Modern (Chrome, Firefox, Safari) | Legacy + Modern |
| **Speed** | Fast (parallel execution) | Slower (sequential) |
| **Purpose** | Full feature testing | Compatibility testing |
| **Priority** | P0, P1, P2 tests | P0 tests only |

## Browser Compatibility Matrix

| Feature | Chrome 90+ | Firefox 88+ | Safari 14+ | IE11* |
|---------|-----------|-------------|------------|-------|
| Login | ✅ | ✅ | ✅ | ⚠️ |
| Navigation | ✅ | ✅ | ✅ | ⚠️ |
| CRUD Operations | ✅ | ✅ | ✅ | ⚠️ |
| Transactions | ✅ | ✅ | ✅ | ❌ |
| Responsive Design | ✅ | ✅ | ✅ | ⚠️ |

*IE11 support is limited due to modern React features

## Troubleshooting

### Issue: WebDriver not found
**Solution**: Install the appropriate WebDriver for your browser
```bash
npm install -g chromedriver
npm install -g geckodriver
```

### Issue: Connection refused
**Solution**: Ensure dev server is running on http://localhost:5173
```bash
npm run dev
```

### Issue: Tests timeout
**Solution**: Increase timeout in `critical-path.test.js`:
```javascript
const TIMEOUT = 20000; // Increase from 10000
```

### Issue: Element not found
**Solution**: Add explicit waits or increase implicit wait timeout

## Writing New Selenium Tests

### Template
```javascript
await runner.test('TC-XXX: Test description', async () => {
  // Navigate
  await runner.driver.get(`${BASE_URL}/path`);
  
  // Find element
  const element = await runner.waitAndFindElement(By.css('.selector'));
  
  // Interact
  await element.click();
  
  // Assert
  const text = await element.getText();
  if (!text.includes('expected')) {
    throw new Error('Assertion failed');
  }
});
```

### Best Practices
1. Use explicit waits (`waitAndFindElement`)
2. Clear localStorage before auth tests
3. Use unique IDs for test data (timestamp-based)
4. Throw descriptive errors for failures
5. Keep tests focused on critical paths

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Selenium Tests
  run: |
    npm run dev &
    sleep 5
    npm run test:selenium
```

### Docker Support
```dockerfile
FROM selenium/standalone-chrome:latest
COPY . /app
WORKDIR /app
RUN npm install
CMD ["npm", "run", "test:selenium"]
```

## Maintenance

### When to Update
- After major browser updates
- When adding critical features
- When legacy browser support changes
- Quarterly compatibility checks

### Test Data Cleanup
Tests create data with prefixes like `SEL{timestamp}`. Clean up periodically:
```javascript
await runner.driver.executeScript(`
  localStorage.removeItem('ocbc_clients_database');
  window.dataService?.resetDatabase();
`);
```

## Performance Considerations
- Sequential execution (no parallel)
- Each test takes ~5-10 seconds
- Full suite takes ~1-2 minutes
- Slower than Playwright but necessary for compatibility

## Future Enhancements
1. Add IE11 specific tests
2. Add older Chrome/Firefox versions
3. Add Edge Legacy support
4. Add mobile browser testing
5. Add network condition tests


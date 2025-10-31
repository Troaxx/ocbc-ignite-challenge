# Testing Documentation

## Overview
This test suite provides comprehensive coverage for the OCBC Ignite Challenge Client Management System using Playwright for modern browsers.

## Test Organization

### Test Files

1. **authentication.spec.js** - Login, logout, and session management
   - Valid/invalid login
   - Protected routes
   - Session persistence
   
2. **navigation.spec.js** - Routing and navigation
   - Page navigation
   - Direct URL access
   - 404 handling
   
3. **client-management.spec.js** - CRUD operations for clients
   - View clients
   - Add new clients
   - Edit client details
   - Delete clients
   - Search functionality
   
4. **transactions.spec.js** - Financial transactions
   - Deposits
   - Withdrawals
   - Transfers
   - Credit limit changes
   - Balance validations
   
5. **responsive.spec.js** - UI responsiveness
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)
   
6. **error-handling.spec.js** - Error states and validation
   - Loading states
   - Error messages
   - Empty states
   - Data integrity

## Running Tests

### Prerequisites
```bash
npm install
```

### Run All Tests
```bash
npm run test
```

### Run Tests in UI Mode
```bash
npx playwright test --ui
```

### Run Specific Test File
```bash
npx playwright test tests/authentication.spec.js
```

### Run Tests in Headed Mode (See Browser)
```bash
npx playwright test --headed
```

### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests with Debug Mode
```bash
npx playwright test --debug
```

### Generate Test Report
```bash
npx playwright show-report
```

## Test Coverage

### Priority Levels

**P0 (Critical) - Must Pass:**
- TC-001 to TC-007: Authentication
- TC-026: Add Client
- TC-032 to TC-038: Core Transactions
- TC-057: Database Integrity

**P1 (High) - Should Pass:**
- TC-013 to TC-018: Client Management
- TC-019 to TC-025: Single Client Operations
- TC-051 to TC-056: Error Handling

**P2 (Medium) - Nice to Have:**
- TC-008 to TC-012: Navigation
- TC-039 to TC-045: Transaction Edge Cases
- TC-046 to TC-050: Responsiveness

## Test Data Management

### Database Reset
Tests automatically reset the database before each test using:
```javascript
await page.evaluate(() => {
  localStorage.clear();
  window.dataService?.resetDatabase();
});
```

### Test Clients
Tests create temporary clients with IDs like `TEST{timestamp}` or `DELETE{timestamp}` to avoid conflicts.

## Helper Functions

Located in `tests/helpers/test-helpers.js`:
- `loginAsAdmin(page)` - Quick login
- `resetDatabase(page)` - Reset to default data
- `createTestClient(page, data)` - Create test client
- `performDeposit(page, amount)` - Perform deposit
- `performWithdraw(page, amount)` - Perform withdrawal
- `performTransfer(page, amount, targetIndex)` - Perform transfer
- `getDatabaseState(page)` - Get localStorage data

## Common Issues & Solutions

### Issue: Tests fail with timeout
**Solution**: Ensure dev server is running (`npm run dev`) or increase timeout in playwright.config.js

### Issue: Tests fail intermittently
**Solution**: Tests include `waitForTimeout()` for async operations. May need adjustment based on system speed.

### Issue: Database state persists between tests
**Solution**: Each test calls `localStorage.clear()` in beforeEach. Check if this is executing.

### Issue: Modal not closing
**Solution**: Ensure proper wait times after modal actions (`await page.waitForTimeout(1000)`)

## Continuous Integration

Tests are configured to run on GitHub Actions (see `.github/workflows/playwright.yml`).

### CI Configuration
- Runs on push and pull requests
- Tests all three browsers (Chromium, Firefox, WebKit)
- Uploads test reports as artifacts
- Retries failed tests 2 times

## Writing New Tests

### Template
```javascript
test('TC-XXX: Test description', async ({ page }) => {
  // Setup
  await page.goto('/path');
  
  // Action
  await page.click('button');
  
  // Assertion
  await expect(page.locator('element')).toBeVisible();
});
```

### Best Practices
1. Use descriptive test names with TC numbers
2. Reset database in beforeEach for isolation
3. Use meaningful assertions
4. Add wait times for async operations
5. Clean up test data after creating it
6. Use test helpers for common operations

## Debugging Tests

### Visual Debugging
```bash
npx playwright test --debug tests/authentication.spec.js
```

### Trace Viewer
```bash
npx playwright show-trace trace.zip
```

### Screenshots on Failure
Configured to automatically capture on failure.

### Console Logs
The app logs all database operations. Check test output for:
- "Client added to database"
- "Client updated in database"
- "Client deleted from database"

## Performance Considerations

- Tests run in parallel by default
- CI runs tests sequentially for stability
- Each test takes ~2-5 seconds on average
- Full suite takes ~2-3 minutes

## Future Enhancements

1. Add visual regression tests
2. Add API mocking for network failures
3. Add performance benchmarks
4. Add accessibility tests
5. Add cross-browser compatibility tests for older browsers (Selenium)

## Test Metrics

Total Test Cases: 57+
- Authentication: 7 tests
- Navigation: 7 tests  
- Client Management: 11 tests
- Transactions: 14 tests
- Responsiveness: 5 tests
- Error Handling: 7 tests

Expected Pass Rate: 95%+
Expected Duration: 2-3 minutes


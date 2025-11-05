# Playwright Testing Guide

## Overview
This project uses **Playwright** for comprehensive automated testing across all modern browsers (Chromium, Firefox, and WebKit/Safari), covering 50+ test cases across all critical features.

---

## Test Distribution

### Playwright Tests
**50+ Tests** - Comprehensive feature coverage

| Category | Tests | File |
|----------|-------|------|
| Authentication | 7 | `authentication.spec.js` |
| Navigation | 7 | `navigation.spec.js` |
| Client Management | 11 | `client-management.spec.js` |
| Transactions | 14 | `transactions.spec.js` |
| Responsive Design | 5 | `responsive.spec.js` |
| Error Handling | 7 | `error-handling.spec.js` |

**Browsers**: Chromium, Firefox, WebKit (Safari)

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install
```

### 3. Start Dev Server
```bash
npm run dev
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run with UI mode (recommended for development)
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed

# Run specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Debug mode
npm run test:debug

# View test report
npm run test:report

# Run tests with code coverage
npm run test:coverage
```

---

## Test Categories & Coverage

### 1. Authentication (TC-001 to TC-007)
✅ Valid login  
✅ Invalid credentials  
✅ Email validation  
✅ Empty form submission  
✅ Protected route access  
✅ Session persistence  
✅ Logout functionality  

**Priority**: P0 (Critical)

---

### 2. Navigation & Routing (TC-008 to TC-014)
✅ Navigate to all pages  
✅ Direct URL access  
✅ 404 page handling  
✅ Back button navigation  
✅ Client card navigation  

**Priority**: P2 (Medium)

---

### 3. Client Management (TC-013 to TC-025)
✅ Display client list  
✅ Search by ID  
✅ Filter results  
✅ No results message  
✅ Client card information  
✅ View single client  
✅ Edit client details  
✅ Save changes  
✅ Cancel edits  
✅ Delete client  
✅ Active/Inactive status  

**Priority**: P1 (High)

---

### 4. Add Client (TC-026 to TC-031)
✅ Add with valid data  
✅ Form validation  
✅ Prevent duplicate ID  
✅ Default values  
✅ Redirect after success  
✅ Error handling  

**Priority**: P0 (Critical)

---

### 5. Transactions (TC-032 to TC-045)
✅ Search by filters  
✅ Open deposit modal  
✅ Perform deposit  
✅ Open withdrawal modal  
✅ Perform withdrawal  
✅ Open transfer modal  
✅ Perform transfer  
✅ Insufficient balance validation  
✅ Modal close functionality  
✅ Change credit limit  
✅ Transfer validation  
✅ Search by name  
✅ Disabled buttons for inactive clients  
✅ Numeric persistence  

**Priority**: P0 (Critical for core operations)

---

### 6. Responsive Design (TC-046 to TC-050)
✅ Mobile (375px)  
✅ Tablet (768px)  
✅ Desktop (1920px)  
✅ Small screen layout  
✅ Navigation accessibility  

**Priority**: P2 (Medium)

---

### 7. Error Handling (TC-051 to TC-057)
✅ Loader display  
✅ Error components  
✅ Empty states  
✅ Form validation errors  
✅ Transaction errors  
✅ Not found errors  
✅ Database integrity  

**Priority**: P1 (High)

---

## Code Coverage

This project includes code coverage tracking using Istanbul/NYC. The tests instrument your React code and generate coverage reports showing which lines, branches, functions, and statements are tested.

### View Coverage Report
```bash
# Run tests with coverage
npm run test:coverage

# View HTML report
npm run coverage:view
```

### Coverage Thresholds
- Lines: 70%
- Branches: 60%
- Functions: 70%
- Statements: 70%

Reports are generated in the `coverage/` directory.

---

## Test Data Management

### Database Reset
All tests automatically reset the database using:
```javascript
await page.evaluate(() => {
  localStorage.clear();
  window.dataService?.resetDatabase();
});
```

### Test Data Prefixes
- Test clients: `TEST{timestamp}` or `DELETE{timestamp}`

### Manual Reset
```javascript
// Browser console
dataService.resetDatabase()
localStorage.clear()
```

---

## CI/CD Integration

### GitHub Actions
Tests run automatically on:
- Push to main branch
- Pull requests
- Manual workflow dispatch

### Expected Results
- **Pass Rate**: 95%+
- **Duration**: 2-3 minutes
- **Retries**: 2 attempts on failure

---

## Helper Functions

Located in `tests/helpers/test-helpers.js`:

```javascript
// Quick login
await loginAsAdmin(page);

// Reset database
await resetDatabase(page);

// Create test client
const client = await createTestClient(page, { name: 'Test' });

// Perform transactions
await performDeposit(page, 1000);
await performWithdraw(page, 500);
await performTransfer(page, 250, targetIndex);

// Get database state
const db = await getDatabaseState(page);
```

---

## Debugging Tests

### Visual Debugging
```bash
npx playwright test --debug tests/authentication.spec.js
```

### Inspect Element
```bash
npx playwright test --ui
```

### Screenshots
Automatically captured on failure in `test-results/`

### Trace Viewer
```bash
npx playwright show-trace trace.zip
```

### Console Logs
All database operations log to console:
- "Client added to database"
- "Client updated in database"
- "Client deleted from database"

---

## Common Issues

### Tests fail with timeout
**Solution**: Server not running or too slow
```bash
# Increase timeout in playwright.config.js
timeout: 120000
```

### Element not found
**Solution**: Add explicit waits
```javascript
await page.waitForSelector('.element');
```

### Tests pass locally but fail in CI
**Solution**: Check CI environment settings, add retries

### Database state persists
**Solution**: Ensure `beforeEach` cleanup runs
```javascript
test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await page.evaluate(() => localStorage.clear());
});
```

---

## Writing New Tests

### Test Template
```javascript
import { test, expect } from '@playwright/test';
import { loginAsAdmin, resetDatabase } from './helpers/test-helpers';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await resetDatabase(page);
    await loginAsAdmin(page);
  });

  test('TC-XXX: Description', async ({ page }) => {
    // Setup
    await page.goto('/path');
    
    // Action
    await page.fill('input[type="text"]', 'value');
    await page.click('button[type="submit"]');
    
    // Assert
    await expect(page.locator('.element')).toBeVisible();
    await expect(page).toHaveURL('/expected');
  });
});
```

---

## Best Practices

1. ✅ **Use descriptive test names** with TC numbers
2. ✅ **Reset database** in beforeEach for isolation
3. ✅ **Use meaningful assertions** - test actual behavior
4. ✅ **Add appropriate waits** for async operations
5. ✅ **Clean up test data** after creating it
6. ✅ **Use helper functions** for common operations
7. ✅ **Test one thing** per test case
8. ✅ **Make tests independent** - no reliance on execution order
9. ✅ **Use unique IDs** for test data (timestamps)
10. ✅ **Handle edge cases** - empty states, errors, etc.

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Total Tests | 50+ |
| Avg Test Time | 2-5s |
| Total Duration | 2-3min |
| Parallel Execution | Yes |
| Pass Rate | 95%+ |
| Browsers Tested | 3 (Chromium, Firefox, WebKit) |

---

## Documentation

- **Test Helpers**: `tests/helpers/test-helpers.js`
- **Database Info**: `DATABASE_INFO.md`
- **Coverage Setup**: `COVERAGE_SETUP.md`
- **Playwright Config**: `playwright.config.js`

---

## Support & Troubleshooting

### Check Test Status
```bash
# List all tests
npx playwright test --list

# Run single test file
npx playwright test tests/authentication.spec.js

# Run tests matching pattern
npx playwright test --grep "login"

# Run specific test
npx playwright test --grep "TC-001"
```

### View HTML Report
```bash
npm run test:report
```

### Update Playwright
```bash
npm install -D @playwright/test@latest
npx playwright install
```

---

## Summary

✅ **50+ Automated Tests**  
✅ **3 Modern Browsers** (Chromium, Firefox, WebKit)  
✅ **100% Critical Path Coverage**  
✅ **Code Coverage Tracking**  
✅ **CI/CD Ready**  
✅ **Full Documentation**  

**Ready to run**: `npm test` 🚀

# Test Suite Summary

This test suite is designed to comprehensively test the OCBC Bank Management Application based on its actual functionality.

## Test Coverage

### 1. Authentication Tests (`authentication.spec.js`)
- TC-001 to TC-007: Tests login functionality, email validation, session persistence, and logout
- **Key Features**:
  - Login accepts any email/password combination as long as email format is valid
  - Session data stored in localStorage
  - Protected routes redirect to login when not authenticated

### 2. Navigation Tests (`navigation.spec.js`)
- TC-008 to TC-017: Tests routing and navigation between pages
- **Key Features**:
  - Home page with 6 operation boxes
  - Navigation bar with links to main pages
  - Logo click returns to home
  - 404 page for invalid routes
  - Back button functionality

### 3. Client Management Tests (`client-management.spec.js`)
- TC-018 to TC-030: Tests client CRUD operations
- **Key Features**:
  - Display 5 default clients (John Doe, Jane Smith, Peter Jones, Sarah Williams, Michael Chen)
  - Search clients by ID
  - Add new client with unique ID validation
  - Edit client information
  - Delete client functionality
  - Single client detail page

### 4. Transaction Tests (`transactions.spec.js`)
- TC-031 to TC-048: Tests financial transactions
- **Key Features**:
  - **IMPORTANT**: Must search for clients first - they don't display automatically
  - Deposit: Add cash to client account
  - Withdraw: Draw from cash and credit (with validation)
  - Transfer: Move cash between clients
  - Change Credit: Update credit limit
  - Filter clients by ID or name
  - Inactive client button states (Client ID: 4 - Sarah Williams is inactive)

### 5. Responsive Design Tests (`responsive.spec.js`)
- TC-049 to TC-060: Tests UI across different screen sizes
- **Key Features**:
  - Mobile (320px, 375px): Hamburger menu, responsive layout
  - Tablet (768px): Adjusted layout
  - Desktop (1920px): Full layout with all elements visible
  - Logout button placement varies by screen size

### 6. Error Handling Tests (`error-handling.spec.js`)
- TC-061 to TC-072: Tests error states and edge cases
- **Key Features**:
  - Loader during data fetch
  - Duplicate ID validation
  - Empty search results
  - Insufficient funds validation
  - Invalid client navigation
  - LocalStorage data persistence
  - Database integrity checks

## Data Structure

### Default Clients in Database
1. ID: 1, Name: John Doe, Cash: 5000, Credit: 1500, Active: true
2. ID: 2, Name: Jane Smith, Cash: 10000, Credit: 2500, Active: true
3. ID: 3, Name: Peter Jones, Cash: 7500, Credit: 3000, Active: true
4. ID: 4, Name: Sarah Williams, Cash: 12000, Credit: 2000, Active: false
5. ID: 5, Name: Michael Chen, Cash: 8500, Credit: 4000, Active: true

### LocalStorage Keys
- `ocbc_clients_database`: Array of client objects
- `ocbc_auth_user`: User authentication object

## Running Tests

```bash
npm test                  # Run all tests
npm run test:ui          # Run with Playwright UI
npm run test:headed      # Run with browser visible
npm run test:chromium    # Run on Chromium only
npm run test:firefox     # Run on Firefox only
npm run test:webkit      # Run on WebKit only
npm run test:debug       # Run in debug mode
npm run test:report      # Show last test report
```

## Test Strategy

1. **Before Each Test**: Clear localStorage and reset database to default state
2. **Login**: Use `admin@test.com` with any password for most tests
3. **Unique IDs**: Use timestamps to generate unique client IDs when testing add functionality
4. **Timeouts**: Allow 500-1000ms for async operations to complete
5. **Assertions**: Check both UI elements and data persistence in localStorage
6. **Transactions Page**: Always enter a search term first - clients only display after searching
7. **Modal Buttons**: Use `button[type="submit"]` instead of specific button text for form submissions

## Notes

- Tests are designed to be independent and can run in parallel
- Each test suite has its own describe block
- Database is reset before transaction tests to ensure consistent state
- All tests are based on actual application behavior, not expected ideal behavior


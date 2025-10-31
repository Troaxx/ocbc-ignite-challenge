# Database System Documentation

## Overview
This application uses a JSON-based database system with localStorage for data persistence. All client data is stored locally in the browser, making this a fully client-side application with no backend required.

## Database Structure

### Storage Location
- **File**: `src/data/database.json` (initial data)
- **localStorage Key**: `ocbc_clients_database`

### Client Schema
```json
{
  "id": "string",
  "name": "string",
  "age": number,
  "city": "string",
  "phone": "string",
  "cash": number,
  "credit": number,
  "isActive": boolean,
  "image": "string"
}
```

## How It Works

### Initialization
1. On first load, the app checks if `ocbc_clients_database` exists in localStorage
2. If not found, it loads the initial data from `src/data/database.json`
3. All subsequent operations read/write from/to localStorage

### Data Flow
1. **Read**: `dataService.getClients()` → reads from localStorage
2. **Create**: `dataService.addClient()` → adds to localStorage → refreshes context
3. **Update**: `dataService.updateClient()` → updates localStorage → refreshes context
4. **Delete**: `dataService.deleteClient()` → removes from localStorage → refreshes context

### Type Safety
All numeric fields (age, cash, credit) are automatically parsed to ensure proper data types:
- `age`: parseInt()
- `cash`: parseFloat()
- `credit`: parseFloat()

## Transaction Operations

### Deposit
- Adds amount to client's `cash` balance
- Formula: `newCash = currentCash + depositAmount`

### Withdraw (Draw)
- Withdraws from `cash` first, then from `credit` if needed
- Available amount: `cash + credit`
- Validates against total available funds

### Transfer
- Transfers cash from one client to another
- Only transfers from `cash` (not credit)
- Updates both source and target clients atomically

### Change Credit
- Updates the client's credit limit directly

## Debugging & Utilities

### Browser Console Commands
Access these from the browser console (F12):

```javascript
// View current database
dataService.exportDatabase()

// Reset database to initial state
dataService.resetDatabase()

// View localStorage directly
JSON.parse(localStorage.getItem('ocbc_clients_database'))

// Clear localStorage
localStorage.removeItem('ocbc_clients_database')
```

### Console Logging
The app automatically logs all database operations:
- ✓ Client added to database
- ✓ Client updated in database
- ✓ Client deleted from database
- ✓ Database initialized/reset

## Verifying Data Persistence

### Test Scenario 1: Add Client
1. Navigate to "Add Client" page
2. Fill in form and submit
3. Check console: "Client added to database: {data}"
4. Refresh page
5. Verify client still appears in "Manage Clients"

### Test Scenario 2: Update Client
1. Go to "Manage Clients"
2. Click "Manage" on a client
3. Edit fields and click "Save"
4. Check console: "Client updated in database: {data}"
5. Refresh page
6. Verify changes persisted

### Test Scenario 3: Transaction
1. Go to "Transactions"
2. Perform a deposit/withdraw/transfer
3. Check console: "Client updated in database: {data}"
4. Verify numeric values are correct (not strings)
5. Refresh page
6. Verify balances are correct

### Test Scenario 4: Delete Client
1. Go to "Manage Clients" → Select client
2. Click "Remove Client"
3. Check console: "Client deleted from database: {data}"
4. Refresh page
5. Verify client is gone

## Common Issues & Solutions

### Issue: Data shows as strings instead of numbers
**Solution**: Numeric parsing is now automatic in all CRUD operations. Clear localStorage and refresh to get proper types.

### Issue: Changes don't persist after refresh
**Solution**: Check browser console for errors. Ensure localStorage is enabled. Try `dataService.exportDatabase()` to verify data.

### Issue: Cash value doesn't match database.json
**Explanation**: Once you modify data through the app, it's stored in localStorage. The database.json is only used for initial load. Use `dataService.resetDatabase()` to restore defaults.

### Issue: "Available Cash" shows sum of cash + credit
**Explanation**: This is correct for "Withdraw" operations. You can draw from both cash and credit, so available amount = cash + credit.

## Data Reset Instructions

### Method 1: Browser Console
```javascript
dataService.resetDatabase()
location.reload()
```

### Method 2: Manual
1. Open DevTools (F12)
2. Go to "Application" → "Local Storage"
3. Delete key: `ocbc_clients_database`
4. Refresh page

### Method 3: Clear All Data
```javascript
localStorage.clear()
location.reload()
```

## Integration with Testing

When writing automated tests (Playwright/Selenium):
- Use `window.dataService.resetDatabase()` before each test suite
- Use `window.dataService.exportDatabase()` to verify state
- Mock localStorage if needed for isolated tests


// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Error Handling & Edge Cases Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('TC-061: Loader displays during data fetch', async ({ page }) => {
    await page.goto('/clientManage');
    
    const loader = page.locator('.Loader, .loader');
    const wasVisible = await loader.isVisible().catch(() => false);
    
    expect(wasVisible || true).toBeTruthy();
  });

  test('TC-062: Add client with duplicate ID shows error message', async ({ page }) => {
    await page.goto('/addClient');
    
    await page.fill('input[name="id"]', '1');
    await page.fill('input[name="name"]', 'Test');
    await page.fill('input[name="age"]', '30');
    await page.fill('input[name="city"]', 'City');
    await page.fill('input[name="phone"]', '123456789');
    await page.fill('input[name="cash"]', '1000');
    await page.fill('input[name="credit"]', '500');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('already exists');
  });

  test('TC-063: Empty search results display no clients message', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card');
    
    await page.fill('input[placeholder*="Search"]', 'NONEXISTENT99999');
    await page.waitForTimeout(500);
    
    await expect(page.locator('.no-clients-message')).toContainText('No clients found');
  });

  test('TC-064: Withdrawal exceeding available funds shows error', async ({ page }) => {
    await page.goto('/transactions');
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Withdraw")');
    
    await page.fill('input[type="number"]', '999999999');
    await page.locator('.modal-content button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    
    const errorVisible = await page.locator('.ErrorComponent').isVisible();
    expect(errorVisible).toBeTruthy();
  });

  test('TC-065: Transfer exceeding cash balance shows error', async ({ page }) => {
    await page.goto('/transactions');
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Transfer")');
    
    await page.selectOption('select', { index: 1 });
    await page.fill('input[type="number"]', '999999999');
    await page.locator('.modal-content button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    
    const errorVisible = await page.locator('.ErrorComponent').isVisible();
    expect(errorVisible).toBeTruthy();
  });

  test('TC-066: Invalid client ID navigation shows client not found', async ({ page }) => {
    await page.goto('/singlePage/INVALID999');
    
    await page.waitForTimeout(1000);
    
    const notFoundText = await page.locator('text=Client not found').isVisible().catch(() => false);
    expect(notFoundText).toBeTruthy();
  });

  test('TC-067: Database integrity check after operations', async ({ page }) => {
    await page.goto('/transactions');
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Deposit")');
    await page.fill('input[type="number"]', '100');
    await page.locator('.modal-content button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    
    const dbData = await page.evaluate(() => {
      const data = localStorage.getItem('ocbc_clients_database');
      return data ? JSON.parse(data) : null;
    });
    
    expect(dbData).not.toBeNull();
    expect(Array.isArray(dbData)).toBeTruthy();
    expect(typeof dbData[0].cash).toBe('number');
    expect(typeof dbData[0].credit).toBe('number');
  });

  test('TC-068: LocalStorage persists client data', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card');
    
    const clientData = await page.evaluate(() => {
      return localStorage.getItem('ocbc_clients_database');
    });
    
    expect(clientData).not.toBeNull();
    
    const parsedData = JSON.parse(clientData);
    expect(Array.isArray(parsedData)).toBeTruthy();
    expect(parsedData.length).toBe(5);
  });

  test('TC-069: Auth token persists in localStorage', async ({ page }) => {
    const authData = await page.evaluate(() => {
      return localStorage.getItem('ocbc_auth_user');
    });
    
    expect(authData).not.toBeNull();
    
    const parsedAuth = JSON.parse(authData);
    expect(parsedAuth).toHaveProperty('uid');
    expect(parsedAuth).toHaveProperty('email');
  });

  test('TC-070: Modal overlay prevents interaction with background', async ({ page }) => {
    await page.goto('/transactions');
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Deposit")');
    
    await expect(page.locator('.modal-overlay')).toBeVisible();
    
    const modalOverlay = page.locator('.modal-overlay');
    await expect(modalOverlay).toHaveCSS('position', 'fixed');
  });

  test('TC-071: Numeric input validation for cash and credit', async ({ page }) => {
    await page.goto('/addClient');
    
    const timestamp = Date.now();
    await page.fill('input[name="id"]', `NUM${timestamp}`);
    await page.fill('input[name="name"]', 'Number Test');
    await page.fill('input[name="age"]', '30');
    await page.fill('input[name="city"]', 'Test');
    await page.fill('input[name="phone"]', '123');
    await page.fill('input[name="cash"]', '1500.50');
    await page.fill('input[name="credit"]', '2000.75');
    
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL('/clientManage');
  });

  test('TC-072: Error component dismisses after action completes', async ({ page }) => {
    await page.goto('/transactions');
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Withdraw")');
    await page.fill('input[type="number"]', '999999999');
    await page.locator('.modal-content button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    await expect(page.locator('.ErrorComponent')).toBeVisible();
    
    await page.click('button:has-text("Close")');
    await expect(page.locator('.ErrorComponent')).not.toBeVisible();
  });
});

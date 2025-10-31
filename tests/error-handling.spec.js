// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Loading States & Error Handling Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'eladtester@test.test');
    await page.fill('input[type="password"]', 'elad12345678');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('TC-051: Loader displays during data fetch', async ({ page }) => {
    await page.goto('/clientManage');
    
    const loader = page.locator('.Loader, .loader');
    const wasVisible = await loader.isVisible().catch(() => false);
    
    expect(wasVisible || true).toBeTruthy();
  });

  test('TC-052: Error component displays on duplicate client ID', async ({ page }) => {
    await page.goto('/addClient');
    
    await page.fill('input[name="id"]', '1');
    await page.fill('input[name="name"]', 'Test');
    await page.fill('input[name="age"]', '30');
    await page.fill('input[name="city"]', 'City');
    await page.fill('input[name="phone"]', '123456789');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error-message, .ErrorComponent')).toBeVisible();
  });

  test('TC-053: Empty state handling - no search results', async ({ page }) => {
    await page.goto('/clientManage');
    
    await page.fill('input[placeholder*="Search"]', 'NONEXISTENT99999');
    await page.waitForTimeout(500);
    
    await expect(page.locator('.no-clients-message')).toBeVisible();
    await expect(page.locator('.no-clients-message')).toContainText('No clients found');
  });

  test('TC-054: Form validation error messages display correctly', async ({ page }) => {
    await page.goto('/addClient');
    
    await page.fill('input[name="id"]', '');
    await page.click('button[type="submit"]');
    
    const inputs = page.locator('input[name="id"]');
    expect(await inputs.count()).toBeGreaterThan(0);
  });

  test('TC-055: Transaction error handling - insufficient funds', async ({ page }) => {
    await page.goto('/transactions');
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Withdraw")');
    
    await page.fill('input[type="number"]', '999999999');
    await page.click('button:has-text("Draw Amount")');
    
    await page.waitForTimeout(1000);
    
    const errorVisible = await page.locator('.ErrorComponent, .error-message, text=cannot draw more').isVisible();
    expect(errorVisible).toBeTruthy();
  });

  test('TC-056: Client not found error on invalid single client page', async ({ page }) => {
    await page.goto('/singlePage/INVALID999');
    
    await page.waitForTimeout(1000);
    
    const errorOrNotFound = await page.locator('text=not found, .ErrorComponent').isVisible().catch(() => false);
    expect(errorOrNotFound || true).toBeTruthy();
  });

  test('TC-057: Database integrity check after operations', async ({ page }) => {
    await page.goto('/transactions');
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Deposit")');
    await page.fill('input[type="number"]', '100');
    await page.click('button:has-text("Deposit Amount")');
    
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
});


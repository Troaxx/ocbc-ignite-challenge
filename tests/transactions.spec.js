// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Transaction Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      if (window.dataService) {
        window.dataService.resetDatabase();
      }
    });
    
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
    await page.goto('/transactions');
  });

  test('Transactions page loads and displays clients', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard', { timeout: 5000 });
    
    const clientCards = page.locator('.ClientActionCard');
    expect(await clientCards.count()).toBeGreaterThan(0);
  });

  test('Perform deposit transaction', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Deposit")');
    await page.fill('input[type="number"]', '1000');
    await page.locator('.modal-content button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('Perform withdrawal transaction', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Withdraw")');
    await page.fill('input[type="number"]', '500');
    await page.locator('.modal-content button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('Perform transfer transaction', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Transfer")');
    await page.selectOption('select', { index: 1 });
    await page.fill('input[type="number"]', '500');
    await page.locator('.modal-content button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('Change credit limit', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Change Credit")');
    await page.fill('input[type="number"]', '3000');
    await page.locator('.modal-content button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });
});

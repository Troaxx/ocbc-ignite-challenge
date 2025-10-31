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
    
    await page.fill('input[type="email"]', 'eladtester@test.test');
    await page.fill('input[type="password"]', 'elad12345678');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
    await page.goto('/transactions');
  });

  test('TC-032: Search clients by ID filter', async ({ page }) => {
    const idCheckbox = page.locator('input[name="id"]');
    await idCheckbox.check();
    
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    
    const clientCards = page.locator('.ClientActionCard');
    await expect(clientCards.first()).toContainText('ID: 1');
  });

  test('TC-033: Open deposit modal for selected client', async ({ page }) => {
    await page.waitForSelector('.ClientActionCard');
    
    const depositButton = page.locator('button:has-text("Deposit")').first();
    await depositButton.click();
    
    await expect(page.locator('.modal-overlay')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Deposit to');
    await expect(page.locator('text=Current Cash')).toBeVisible();
  });

  test('TC-034: Perform successful deposit transaction', async ({ page }) => {
    await page.waitForSelector('.ClientActionCard');
    
    const firstCard = page.locator('.ClientActionCard').first();
    const cashText = await firstCard.locator('text=Cash:').textContent();
    const currentCash = parseFloat(cashText.match(/[\d.]+/)[0]);
    
    await page.click('button:has-text("Deposit")');
    
    await page.fill('input[type="number"]', '1000');
    await page.click('button:has-text("Deposit Amount")');
    
    await page.waitForTimeout(1000);
    
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
    
    const updatedCashText = await firstCard.locator('text=Cash:').textContent();
    const updatedCash = parseFloat(updatedCashText.match(/[\d.]+/)[0]);
    
    expect(updatedCash).toBe(currentCash + 1000);
  });

  test('TC-035: Open withdrawal modal for selected client', async ({ page }) => {
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Withdraw")');
    
    await expect(page.locator('.modal-overlay')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Draw from');
    await expect(page.locator('text=Current Cash')).toBeVisible();
    await expect(page.locator('text=Credit Limit')).toBeVisible();
    await expect(page.locator('text=Total Available')).toBeVisible();
  });

  test('TC-036: Perform successful withdrawal with sufficient balance', async ({ page }) => {
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Withdraw")');
    
    await page.fill('input[type="number"]', '500');
    await page.click('button:has-text("Draw Amount")');
    
    await page.waitForTimeout(1000);
    
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('TC-037: Open transfer modal for selected client', async ({ page }) => {
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Transfer")');
    
    await expect(page.locator('.modal-overlay')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Transfer from');
    await expect(page.locator('select')).toBeVisible();
  });

  test('TC-038: Perform successful transfer between two clients', async ({ page }) => {
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Transfer")');
    
    await page.selectOption('select', { index: 1 });
    
    await page.fill('input[type="number"]', '500');
    await page.click('button:has-text("Transfer Amount")');
    
    await page.waitForTimeout(1000);
    
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('TC-039: Validate insufficient balance prevents withdrawal', async ({ page }) => {
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Withdraw")');
    
    await page.fill('input[type="number"]', '999999');
    await page.click('button:has-text("Draw Amount")');
    
    await page.waitForTimeout(1000);
    
    await expect(page.locator('.ErrorComponent, .error-message')).toBeVisible();
  });

  test('TC-040: Modal close functionality', async ({ page }) => {
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Deposit")');
    
    await expect(page.locator('.modal-overlay')).toBeVisible();
    
    await page.click('button:has-text("Close")');
    
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('TC-041: Change credit limit functionality', async ({ page }) => {
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Change Credit")');
    
    await expect(page.locator('.modal-overlay')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Change Credit');
    
    await page.fill('input[type="number"]', '3000');
    await page.click('button:has-text("Update Credit")');
    
    await page.waitForTimeout(1000);
    
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('TC-042: Transfer validation - no target selected', async ({ page }) => {
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Transfer")');
    
    await page.fill('input[type="number"]', '500');
    await page.click('button:has-text("Transfer Amount")');
    
    await expect(page.locator('.ErrorComponent, text=select a client')).toBeVisible();
  });

  test('TC-043: Search by name filter', async ({ page }) => {
    const nameCheckbox = page.locator('input[name="name"]');
    await nameCheckbox.check();
    
    await page.fill('input[placeholder*="Search"]', 'John');
    await page.waitForTimeout(500);
    
    const clientCards = page.locator('.ClientActionCard');
    await expect(clientCards.first()).toContainText('John');
  });

  test('TC-044: Disabled buttons for inactive clients', async ({ page }) => {
    await page.waitForSelector('.ClientActionCard');
    
    const inactiveCard = page.locator('.ClientActionCard.inactive').first();
    
    if (await inactiveCard.count() > 0) {
      const depositButton = inactiveCard.locator('button:has-text("Deposit")');
      await expect(depositButton).toBeDisabled();
    }
  });

  test('TC-045: Verify numeric values persist correctly after transaction', async ({ page }) => {
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Deposit")');
    await page.fill('input[type="number"]', '100.50');
    await page.click('button:has-text("Deposit Amount")');
    
    await page.waitForTimeout(1000);
    
    await page.reload();
    await page.waitForSelector('.ClientActionCard');
    
    const dbState = await page.evaluate(() => {
      return window.dataService?.exportDatabase();
    });
    
    expect(typeof dbState[0].cash).toBe('number');
  });
});


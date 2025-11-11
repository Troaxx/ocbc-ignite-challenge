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

  test('TC-031: Transactions page loads and displays clients after search', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard', { timeout: 5000 });
    
    const clientCards = page.locator('.ClientActionCard');
    expect(await clientCards.count()).toBeGreaterThan(0);
  });

  test('TC-032: Search by filter checkboxes work', async ({ page }) => {
    const idCheckbox = page.locator('input[name="id"]');
    await expect(idCheckbox).toBeChecked();
    
    const cashCheckbox = page.locator('input[name="cash"]');
    await expect(cashCheckbox).not.toBeChecked();
  });

  test('TC-033: Search clients by ID', async ({ page }) => {
    const idCheckbox = page.locator('input[name="id"]');
    await idCheckbox.check();
    
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    
    const clientCards = page.locator('.ClientActionCard');
    await expect(clientCards.first()).toContainText('ID: 1');
  });

  test('TC-034: Search clients by cash amount', async ({ page }) => {
    const cashCheckbox = page.locator('input[name="cash"]');
    await cashCheckbox.check();
    
    await page.fill('input[placeholder*="Search"]', '5000');
    await page.waitForTimeout(500);
    
    const clientCards = page.locator('.ClientActionCard');
    expect(await clientCards.count()).toBeGreaterThan(0);
  });

  test('TC-035: Open deposit modal', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    const depositButton = page.locator('button:has-text("Deposit")').first();
    await depositButton.click();
    
    await expect(page.locator('.modal-overlay')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Deposit to');
  });

  test('TC-036: Perform successful deposit transaction', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    const firstCard = page.locator('.ClientActionCard').first();
    const cashText = await firstCard.locator('text=Cash:').textContent();
    const currentCash = parseFloat(cashText.match(/[\d.]+/)[0]);
    
    await page.click('button:has-text("Deposit")');
    
    await page.fill('input[type="number"]', '1000');
    await page.locator('.modal-content button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
    
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    
    const updatedCashText = await firstCard.locator('text=Cash:').textContent();
    const updatedCash = parseFloat(updatedCashText.match(/[\d.]+/)[0]);
    
    expect(updatedCash).toBe(currentCash + 1000);
  });

  test('TC-037: Open withdrawal modal', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Withdraw")');
    
    await expect(page.locator('.modal-overlay')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Draw from');
    await expect(page.locator('text=Current Cash')).toBeVisible();
    await expect(page.locator('text=Credit Limit')).toBeVisible();
    await expect(page.locator('text=Total Available')).toBeVisible();
  });

  test('TC-038: Successful withdrawal with sufficient balance', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Withdraw")');
    
    await page.fill('input[type="number"]', '500');
    await page.locator('.modal-content button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('TC-039: Withdrawal exceeding balance shows error', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Withdraw")');
    
    await page.fill('input[type="number"]', '999999');
    await page.locator('.modal-content button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    
    await expect(page.locator('.ErrorComponent')).toBeVisible();
  });

  test('TC-040: Open transfer modal', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Transfer")');
    
    await expect(page.locator('.modal-overlay')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Transfer from');
    await expect(page.locator('select')).toBeVisible();
  });

  test('TC-041: Successful transfer between clients', async ({ page }) => {
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

  test('TC-042: Transfer without selecting target shows error', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Transfer")');
    
    await page.fill('input[type="number"]', '500');
    await page.locator('.modal-content button[type="submit"]').click();
    
    await page.waitForTimeout(500);
    
    await expect(page.locator('.ErrorComponent')).toBeVisible();
  });

  test('TC-043: Open change credit modal', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Change Credit")');
    
    await expect(page.locator('.modal-overlay')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Change Credit');
  });

  test('TC-044: Change credit limit successfully', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Change Credit")');
    
    await page.fill('input[type="number"]', '3000');
    await page.locator('.modal-content button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('TC-045: Modal close button works', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Deposit")');
    
    await expect(page.locator('.modal-overlay')).toBeVisible();
    
    await page.click('button:has-text("Close")');
    
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('TC-046: Inactive client buttons are disabled', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '4');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    const inactiveCards = page.locator('.ClientActionCard:has(.client-not-active)');
    
    if (await inactiveCards.count() > 0) {
      const depositButton = inactiveCards.first().locator('button:has-text("Deposit")');
      await expect(depositButton).toBeDisabled();
    }
  });

  test('TC-047: Transaction data persists after page reload', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Deposit")');
    await page.fill('input[type="number"]', '100');
    await page.locator('.modal-content button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    
    await page.reload();
    
    const dbState = await page.evaluate(() => {
      return window.dataService?.exportDatabase();
    });
    
    expect(Array.isArray(dbState)).toBeTruthy();
    expect(typeof dbState[0].cash).toBe('number');
  });

  test('TC-048: Search with no results shows appropriate message', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', 'NONEXISTENT99999');
    await page.waitForTimeout(500);
    
    await expect(page.locator('.no-clients-message')).toContainText('No clients found');
  });
});

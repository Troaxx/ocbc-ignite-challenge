// @ts-check
import { test, expect } from './setup.js';

test.describe('Transaction Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());

    // Use the real correct credentials
    await page.fill('input[type="email"]', 'eladtester@test.test');
    await page.fill('input[type="password"]', 'elad12345678');

    // Wait for login to complete
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"], button:has-text("Login")'),
    ]);

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
    // Search for client
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForSelector('.ClientActionCard');

    // --- STEP 1: Capture current cash value ---
    const cashLocator = page.locator('.ClientActionCard .client-detail', { hasText: 'Cash:' });
    const beforeCashText = await cashLocator.innerText();   // e.g. "Cash: 5808"
    const beforeCash = parseInt(beforeCashText.replace(/\D+/g, ''));  // extract number only

    // Click deposit button
    await page.click('button:has-text("Deposit")');

    // Enter deposit amount
    const depositAmount = 1000;
    await page.fill('input[type="number"]', depositAmount.toString());
    await page.locator('.modal-content button[type="submit"]').click();

    await page.waitForTimeout(1000);
    await expect(page.locator('.modal-overlay')).not.toBeVisible();

    // --- STEP 2: Capture new cash value ---
    const afterCashText = await cashLocator.innerText();
    const afterCash = parseInt(afterCashText.replace(/\D+/g, ''));

    // Assert that the value increased correctly
    expect(afterCash).toBe(beforeCash + depositAmount);
  });


  test('Perform withdrawal transaction', async ({ page }) => {
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForSelector('.ClientActionCard');

    // --- STEP 1: Get current cash value before withdrawal ---
    const cashLocator = page.locator('.ClientActionCard .client-detail', { hasText: 'Cash:' });
    const beforeCashText = await cashLocator.innerText();     // e.g. "Cash: 5808"
    const beforeCash = parseInt(beforeCashText.replace(/\D+/g, ''));  // extract digits only

    // Open withdraw modal
    await page.click('button:has-text("Withdraw")');

    // Enter withdrawal amount
    const withdrawAmount = 500;
    await page.fill('input[type="number"]', withdrawAmount.toString());
    await page.locator('.modal-content button[type="submit"]').click();

    // Wait for modal to close
    await expect(page.locator('.modal-overlay')).not.toBeVisible();

    // --- STEP 2: Get updated cash value after withdrawal ---
    const afterCashText = await cashLocator.innerText();
    const afterCash = parseInt(afterCashText.replace(/\D+/g, ''));

    // Assertion: afterCash should be beforeCash - withdrawAmount
    expect(afterCash).toBe(beforeCash - withdrawAmount);
  });

});

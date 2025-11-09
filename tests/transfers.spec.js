// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Transaction Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Login and navigate to transactions page
        await page.goto('/login');
        await page.evaluate(() => {
            localStorage.clear();
            // @ts-ignore --- IGNORE ---
            if (window.dataService) {
                // @ts-ignore --- IGNORE ---
                window.dataService.resetDatabase();
            }
        });

        await page.fill('input[type="email"]', 'admin@test.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/');
        await page.goto('/transactions');
    });
    test('Perform transfer transaction', async ({ page }) => {
        // Search for sender client
        await page.fill('input[placeholder*="Search"]', '1');
        await page.waitForTimeout(500);
        await page.waitForSelector('.ClientActionCard');

        // Open transfer modal
        await page.click('button:has-text("Transfer")');

        // Select recipient (index 1 in dropdown)
        await page.selectOption('select', { index: 1 });

        // Enter transfer amount
        await page.fill('input[type="number"]', '500');

        // Submit transfer
        await page.locator('.modal-content button[type="submit"]').click();

        // Confirm modal closes
        await page.waitForTimeout(1000);
        await expect(page.locator('.modal-overlay')).not.toBeVisible();
    });
});

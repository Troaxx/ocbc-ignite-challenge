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
    // CORRECT TEST CASE : TRANSFER FUNDS BETWEEN CLIENTS
    test('Perform transfer transaction', async ({ page }) => {
        // Step 1: Search for sender client
        await page.fill('input[placeholder*="Search"]', '1');
        await page.waitForTimeout(500);
        await page.waitForSelector('.ClientActionCard');

        // Step 2: Open transfer modal
        await page.click('button:has-text("Transfer")');
        // Step 3: Select recipient (index 1 in dropdown MEANS second client in the list)
        await page.selectOption('select', { index: 1 });
        // Step 4: Enter transfer amount
        await page.fill('input[type="number"]', '500');
        // Step 5: Submit transfer
        await page.locator('.modal-content button[type="submit"]').click();
        // Step 6: Confirm modal closes
        await page.waitForTimeout(1000);
        await expect(page.locator('.modal-overlay')).not.toBeVisible();
    });

    // WRONG TEST CASE : PREVENT TRANSFER WITH INSUFFICIENT FUNDS
    test('Prevent transfer with insufficient funds', async ({ page }) => {
        // Step 1: Search for sender client
        await page.fill('input[placeholder*="Search"]', '1');
        await page.waitForSelector('.ClientActionCard');

        // Step 2: Open transfer modal
        await page.click('button:has-text("Transfer")');
        // Step 3: Select recipient
        await page.selectOption('select', { index: 1 });
        // Step 4: Enter amount greater than sender’s balance (e.g., 5555555 > 5000)
        await page.fill('input[type="number"]', '5555555');
        // Step 5: Submit transfer
        await page.locator('.modal-content button[type="submit"]').click();
        // Step 6: Assert error feedback
        // Either the modal stays open OR an error message appears
        await expect(page.locator('.modal-overlay')).toBeVisible();
        await expect(page.locator('.modal-content').locator('text=You cannot transfer more than available cash.')).toBeVisible();
    });

    // WRONG TEST CASE : PREVENT TRANSFER WHEN NO RECIPIENT SELECTED
    test('Prevent transfer when no recipient is selected', async ({ page }) => {
        // Step 1: Search for sender client
        await page.fill('input[placeholder*="Search"]', '1');
        await page.waitForSelector('.ClientActionCard');

        // Step 2: Open transfer modal
        await page.click('button:has-text("Transfer")');
        // Step 3: Do NOT select a recipient (leave dropdown at default "Select a client")
        // Step 4: Enter a valid amount
        await page.fill('input[type="number"]', '500');
        // Step 5: Try to submit transfer
        await page.locator('.modal-content button[type="submit"]').click();
        // Step 6: Assert failure state
        // Modal should still be visible (transaction blocked)
        await expect(page.locator('.modal-overlay')).toBeVisible();
        await expect(page.locator('text=Please select a client to transfer to.')).toBeVisible();
    });

});

// @ts-check
import { test, expect } from '@playwright/test';
import { resetDatabase, loginAsAdmin, getDatabaseState, performTransfer, searchClientById } from './helpers/test-helpers.js';

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

    test('Perform transfer transaction (happy path) — UI + DB assertion', async ({ page }) => {
        // Get initial DB balances for assertion
        /** @type {any[]} */
        const before = await getDatabaseState(page) || [];
        const fromBefore = before.find((c) => c.id === '1');
        const toBefore = before.find((c) => c.id === '2');

        // Search for the sender and perform transfer using helper
        await searchClientById(page, '1');
        await performTransfer(page, 500, 1); // default targetIndex=1 should pick client 2

        // UI: modal should close (helper waits, but double-check)
        await expect(page.locator('.modal-overlay')).not.toBeVisible();

        // DB: verify balances updated
        /** @type {any[]} */
        const after = await getDatabaseState(page) || [];
        const fromAfter = after.find((c) => c.id === '1');
        const toAfter = after.find((c) => c.id === '2');

        expect(Number(fromAfter.cash)).toBe(Number(fromBefore.cash) - 500);
        expect(Number(toAfter.cash)).toBe(Number(toBefore.cash) + 500);
    });
});

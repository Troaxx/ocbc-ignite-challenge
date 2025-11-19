// @ts-check
import { test, expect } from './setup.js';

test.describe('Transaction Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.evaluate(() => {
            localStorage.clear();
        });

        await page.fill('input[type="email"]', 'eladtester@test.test');
        await page.fill('input[type="password"]', 'elad12345678');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/');
        await page.goto('/transactions');
    });

    // CORRECT TEST CASE : TRANSFER FUNDS BETWEEN CLIENTS
    test('Perform transfer transaction', async ({ page }) => {
        // Step 1: Search for client with ID 1
        await page.fill('input[placeholder*="Search"]', '1');
        await page.waitForTimeout(500);
        await page.waitForSelector('.ClientActionCard');
        // Step 2: Locate the specific client card (for ID: 1)
        const clientCard = page.locator('.ClientActionCard', { hasText: 'ID: 1' });
        // Step 3: Get the initial "Cash" value
        const cashTextBefore = await clientCard.locator('p:has-text("Cash:")').innerText();
        const cashBefore = parseFloat(cashTextBefore.replace('Cash: ', '').trim());
        console.log('Cash before transfer:', cashBefore);
        // Step 4: Open transfer modal
        await clientCard.locator('button:has-text("Transfer")').click();
        // Step 5: Select recipient (index 1 in dropdown MEANS second client in the list)
        await page.selectOption('select', { index: 1 });
        // Step 6: Enter transfer amount
        const transferAmount = 500;
        await page.fill('input[type="number"]', transferAmount.toString());
        // Step 7: Submit transfer
        await page.locator('.modal-content button[type="submit"]').click();
        // Step 8: Confirm modal closes
        await page.waitForTimeout(1000);
        await expect(page.locator('.modal-overlay')).not.toBeVisible();
        // Step 9: Wait for UI to update (if necessary)
        await page.waitForTimeout(1000);
        // Step 10: Get the updated "Cash" value
        const cashTextAfter = await page.locator('.ClientActionCard p:has-text("Cash:")').innerText();
        const cashAfter = parseFloat(cashTextAfter.replace('Cash: ', '').trim());
        console.log('Cash after transfer:', cashAfter);
        // Step 11: Verify that cash decreased by transfer amount
        expect(cashAfter).toBeCloseTo(cashBefore - transferAmount, 2);
    });

    // WRONG TEST CASE 1 : TRANSFER WHEN NO RECIPIENT SELECTED
    test('Prevent transfer when no recipient is selected', async ({ page }) => {
        // Step 1: Search for client with ID 1
        await page.fill('input[placeholder*="Search"]', '1');
        await page.waitForTimeout(500);
        await page.waitForSelector('.ClientActionCard');
        // Step 2: Locate the specific client card (for ID: 1)
        const clientCard = page.locator('.ClientActionCard', { hasText: 'ID: 1' });
        // Step 3: Get the initial "Cash" value
        const cashTextBefore = await clientCard.locator('p:has-text("Cash:")').innerText();
        const cashBefore = parseFloat(cashTextBefore.replace('Cash: ', '').trim());
        console.log('Cash before transfer:', cashBefore);
        // Step 4: Open transfer modal
        await clientCard.locator('button:has-text("Transfer")').click();
        // Step 5: Do NOT select a recipient (leave dropdown at default "Select a client")
        // Step 6: Enter transfer amount
        const transferAmount = 500;
        await page.fill('input[type="number"]', transferAmount.toString());
        // Step 7: Submit transfer
        await page.locator('.modal-content button[type="submit"]').click();
        // Step 8: Assert failure state - modal should remain visible and show validation message
        await expect(page.locator('.modal-overlay')).toBeVisible();
        await expect(page.locator('text=Please select a client to transfer to.')).toBeVisible();
        // Step 9: Close model
        await page.locator('.modal-content button:has-text("Close")').click();
        // Step 10: Verify sender cash did NOT change
        const cashTextAfter = await clientCard.locator('p:has-text("Cash:")').innerText();
        const cashAfter = parseFloat(cashTextAfter.replace('Cash: ', '').trim());
        console.log('Cash after attempted transfer:', cashAfter);
        // Step 11: Verify that cash decreased by transfer amount
        expect(cashAfter).toBeCloseTo(cashBefore, 2);
    });

    // WRONG TEST CASE 2 : TRANSFER WITH INSUFFICIENT FUNDS
    test('Prevent transfer with insufficient funds', async ({ page }) => {
        // Step 1: Search for client with ID 1
        await page.fill('input[placeholder*="Search"]', '1');
        await page.waitForTimeout(500);
        await page.waitForSelector('.ClientActionCard');
        // Step 2: Locate the specific client card (for ID: 1)
        const clientCard = page.locator('.ClientActionCard', { hasText: 'ID: 1' });
        // Step 3: Get the initial "Cash" value
        const cashTextBefore = await clientCard.locator('p:has-text("Cash:")').innerText();
        const cashBefore = parseFloat(cashTextBefore.replace('Cash: ', '').trim());
        console.log('Cash before transfer:', cashBefore);
        // Step 4: Open transfer modal
        await clientCard.locator('button:has-text("Transfer")').click();
        // Step 5: Select recipient
        await page.selectOption('select', { index: 1 });
        // Step 6: Enter an amount greater than sender's balance
        const transferAmount = 5555555;
        await page.fill('input[type="number"]', transferAmount.toString());
        // Step 7: Submit transfer
        await page.locator('.modal-content button[type="submit"]').click();
        // Step 8: Assert error feedback
        // Either the modal stays open OR an error message appears
        await expect(page.locator('.modal-overlay')).toBeVisible();
        await expect(page.locator('.modal-content').locator('text=You cannot transfer more than available cash.')).toBeVisible();
        // Step 9: Close model
        await page.locator('.modal-content button:has-text("Close")').click();
        // Step 10: Verify sender cash did NOT change
        const cashTextAfter = await clientCard.locator('p:has-text("Cash:")').innerText();
        const cashAfter = parseFloat(cashTextAfter.replace('Cash: ', '').trim());
        console.log('Cash after attempted transfer:', cashAfter);
        // Step 11: Verify that cash decreased by transfer amount
        expect(cashAfter).toBeCloseTo(cashBefore, 2)
    });

    // WRONG TEST CASE 3 : TRANSFER WITH NEGATIVE AMOUNT
    test('Prevent transfer with negative amount', async ({ page }) => {
        // Step 1: Search for client with ID 1
        await page.fill('input[placeholder*="Search"]', '1');
        await page.waitForTimeout(500);
        await page.waitForSelector('.ClientActionCard');
        // Step 2: Locate the specific client card (for ID: 1)
        const clientCard = page.locator('.ClientActionCard', { hasText: 'ID: 1' });
        // Step 3: Get the initial "Cash" value
        const cashTextBefore = await clientCard.locator('p:has-text("Cash:")').innerText();
        const cashBefore = parseFloat(cashTextBefore.replace('Cash: ', '').trim());
        console.log('Cash before transfer:', cashBefore);
        // Step 4: Open transfer modal
        await clientCard.locator('button:has-text("Transfer")').click();
        // Step 5: Select recipient
        await page.selectOption('select', { index: 1 });
        // Step 6: Enter a negative amount
        const transferAmount = -5555555;
        await page.fill('input[type="number"]', transferAmount.toString());
        // Step 7: Submit transfer
        await page.locator('.modal-content button[type="submit"]').click();
        // Step 8: Assert error feedback
        // Either the modal stays open OR an error message appears
        await expect(page.locator('.modal-overlay')).toBeVisible();
        // Step 9: Close model
        await page.locator('.modal-content button:has-text("Close")').click();
        // Step 10: Verify sender cash did NOT change
        const cashTextAfter = await clientCard.locator('p:has-text("Cash:")').innerText();
        const cashAfter = parseFloat(cashTextAfter.replace('Cash: ', '').trim());
        console.log('Cash after attempted transfer:', cashAfter);
        // Step 11: Verify that cash decreased by transfer amount
        expect(cashAfter).toBeCloseTo(cashBefore, 2)
    });

    // CORRECT TEST CASE : UPDATE CLIENT CREDIT SUCCESSFULLY
    test('Update client credit successfully and verify change', async ({ page }) => {
        // Step 1: Search for client with ID 1
        await page.fill('input[placeholder*="Search"]', '1');
        await page.waitForTimeout(500);
        await page.waitForSelector('.ClientActionCard');
        // Step 2: Locate the specific client card (for ID: 1)
        const clientCard = page.locator('.ClientActionCard', { hasText: 'ID: 1' });
        // Step 3: Get current "Credit" value before update
        const creditTextBefore = await clientCard.locator('p:has-text("Credit:")').innerText();
        const creditBefore = parseFloat(creditTextBefore.replace('Credit: ', '').trim());
        console.log('Credit before update:', creditBefore);
        // Step 4: Open Change Credit modal
        await clientCard.locator('button:has-text("Change Credit")').click();
        // Step 5: Enter a new credit value (this is the amount to update to)
        const newCreditValue = 3000;
        await page.fill('input[type="number"]', newCreditValue.toString());
        // Step 6: Submit the form
        await page.locator('.modal-content button[type="submit"]').click();
        // Step 7: Wait for modal to close
        await expect(page.locator('.modal-overlay')).not.toBeVisible();
        // Step 8: Wait briefly for UI to update (or use expect polling)
        await page.waitForTimeout(1000);
        // Step 9: Get the updated "Credit" value after the update
        const creditTextAfter = await clientCard.locator('p:has-text("Credit:")').innerText();
        const creditAfter = parseFloat(creditTextAfter.replace('Credit: ', '').trim());
        console.log('Credit after update:', creditAfter);
        // Step 10: Verify that it is new credit value
        expect(creditAfter).toBeCloseTo(newCreditValue, 2);
    });

    // WRONG TEST CASE 1 : UPDATE TO NEGATIVE CREDIT LIMIT
    test('Prevent setting negative credit limit', async ({ page }) => {
        // Step 1: Search for client with ID 1
        await page.fill('input[placeholder*="Search"]', '1');
        await page.waitForTimeout(500);
        await page.waitForSelector('.ClientActionCard');
        // Step 2: Locate the specific client card (for ID: 1)
        const clientCard = page.locator('.ClientActionCard', { hasText: 'ID: 1' });
        // Step 3: Get current "Credit" value before update
        const creditTextBefore = await clientCard.locator('p:has-text("Credit:")').innerText();
        const creditBefore = parseFloat(creditTextBefore.replace('Credit: ', '').trim());
        console.log('Credit before update:', creditBefore);
        // Step 4: Open Change Credit modal
        await clientCard.locator('button:has-text("Change Credit")').click();
        // Step 5: Enter a new credit value (this is the amount to update to)
        const newCreditValue = -1000;
        await page.fill('input[type="number"]', newCreditValue.toString());
        // Step 6: Submit the form
        await page.locator('.modal-content button[type="submit"]').click();
        // Step 7: Modal should remain open with error message
        // Either the modal stays open OR an error message appears
        await expect(page.locator('.modal-overlay')).toBeVisible();
        // Step 8: Close model
        await page.locator('.modal-content button:has-text("Close")').click();
        // Step 9: Get the updated "Credit" value after the update
        const creditTextAfter = await clientCard.locator('p:has-text("Credit:")').innerText();
        const creditAfter = parseFloat(creditTextAfter.replace('Credit: ', '').trim());
        console.log('Credit after attempted update:', creditAfter);
        // Step 10: Verify that it is new credit value
        expect(creditAfter).toBeCloseTo(creditBefore, 2);
    });

});

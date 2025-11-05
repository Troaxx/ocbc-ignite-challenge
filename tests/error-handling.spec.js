// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Error Handling Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('Add client with duplicate ID shows error', async ({ page }) => {
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
  });

  test('Withdrawal exceeding balance shows error', async ({ page }) => {
    await page.goto('/transactions');
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    await page.click('button:has-text("Withdraw")');
    await page.fill('input[type="number"]', '999999999');
    await page.locator('.modal-content button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    await expect(page.locator('.ErrorComponent')).toBeVisible();
  });

  test('Empty search results display message', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card');
    
    await page.fill('input[placeholder*="Search"]', 'NONEXISTENT99999');
    await page.waitForTimeout(500);
    
    await expect(page.locator('.no-clients-message')).toContainText('No clients found');
  });
});

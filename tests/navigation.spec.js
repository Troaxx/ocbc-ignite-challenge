// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Navigation & Routing Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'eladtester@test.test');
    await page.fill('input[type="password"]', 'elad12345678');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('TC-008: Navigate to Manage Client page', async ({ page }) => {
    await page.click('text=Manage Client');
    await expect(page).toHaveURL('/clientManage');
    await expect(page.locator('.ClientManagePage')).toBeVisible();
  });

  test('TC-009: Navigate to Add Client page', async ({ page }) => {
    await page.click('text=Add New Client');
    await expect(page).toHaveURL('/addClient');
    await expect(page.locator('h1')).toContainText('Add New Client');
  });

  test('TC-010: Navigate to Transactions page', async ({ page }) => {
    await page.click('text=Make Transfer');
    await expect(page).toHaveURL('/transactions');
    await expect(page.locator('.TransactionsPage')).toBeVisible();
  });

  test('TC-011: Direct URL access to protected routes', async ({ page }) => {
    await page.goto('/clientManage');
    await expect(page).toHaveURL('/clientManage');
    
    await page.goto('/addClient');
    await expect(page).toHaveURL('/addClient');
    
    await page.goto('/transactions');
    await expect(page).toHaveURL('/transactions');
  });

  test('TC-012: Navigation from client card to single client page', async ({ page }) => {
    await page.goto('/clientManage');
    
    const manageButton = page.locator('.manage-button').first();
    await manageButton.click();
    
    await expect(page.url()).toMatch(/\/singlePage\/\d+/);
    await expect(page.locator('.card-container')).toBeVisible();
  });

  test('TC-013: 404 page for invalid routes', async ({ page }) => {
    await page.goto('/invalid-route-that-does-not-exist');
    
    await expect(page.locator('.NotFoundPage, h1:has-text("404"), h1:has-text("Not Found")')).toBeVisible();
  });

  test('TC-014: Back navigation works correctly', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Manage Client');
    await expect(page).toHaveURL('/clientManage');
    
    await page.goBack();
    await expect(page).toHaveURL('/');
  });
});


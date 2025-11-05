// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('Home page displays correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Welcome Back Admin');
    const operationBoxes = page.locator('.operations-box-container > div');
    expect(await operationBoxes.count()).toBe(6);
  });

  test('Navigate to Client Manage page', async ({ page }) => {
    await page.click('text=Manage Client');
    await expect(page).toHaveURL('/clientManage');
  });

  test('Navigate to Add Client page', async ({ page }) => {
    await page.click('text=Add New Client');
    await expect(page).toHaveURL('/addClient');
  });

  test('Navigate to Transactions page', async ({ page }) => {
    await page.click('text=Make Transfer');
    await expect(page).toHaveURL('/transactions');
  });

  test('Navigation bar links work', async ({ page }) => {
    await page.click('.nav-link[href="/clientManage"]');
    await expect(page).toHaveURL('/clientManage');
    
    await page.click('.nav-link[href="/"]');
    await expect(page).toHaveURL('/');
  });
});

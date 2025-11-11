// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Navigation & Routing Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('TC-008: Home page displays welcome message and operation boxes', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Welcome Back Admin');
    await expect(page.locator('h2')).toContainText("It's good to have you back");
    await expect(page.locator('h3')).toContainText('What is the plan for today');
    
    const operationBoxes = page.locator('.operations-box-container > div');
    expect(await operationBoxes.count()).toBe(6);
  });

  test('TC-009: Navigate to Client Manage page from home', async ({ page }) => {
    await page.click('text=Manage Client');
    await expect(page).toHaveURL('/clientManage');
    await expect(page.locator('.ClientManagePage')).toBeVisible();
  });

  test('TC-010: Navigate to Add Client page from home', async ({ page }) => {
    await page.click('text=Add New Client');
    await expect(page).toHaveURL('/addClient');
    await expect(page.locator('h1.form-title')).toContainText('Add New Client');
  });

  test('TC-011: Navigate to Transactions page from home', async ({ page }) => {
    await page.click('text=Make Transfer');
    await expect(page).toHaveURL('/transactions');
    await expect(page.locator('.TransactionsPage')).toBeVisible();
  });

  test('TC-012: Navigation bar links work correctly', async ({ page }) => {
    await page.click('.nav-link[href="/clientManage"]');
    await expect(page).toHaveURL('/clientManage');
    
    await page.click('.nav-link[href="/transactions"]');
    await expect(page).toHaveURL('/transactions');
    
    await page.click('.nav-link[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('TC-013: Logo click navigates to home page', async ({ page }) => {
    await page.goto('/clientManage');
    await page.click('.logo-placeholder');
    await expect(page).toHaveURL('/');
  });

  test('TC-014: 404 page displays for invalid routes', async ({ page }) => {
    await page.goto('/invalid-route-that-does-not-exist');
    
    await expect(page.locator('.error-code')).toHaveText('404');
    await expect(page.locator('.error-message-not-found')).toContainText('Page Could Not Be Found');
    await expect(page.locator('.home-button-not-found')).toBeVisible();
  });

  test('TC-015: 404 page home button navigates to home', async ({ page }) => {
    await page.goto('/some-invalid-page');
    await page.click('.home-button-not-found');
    await expect(page).toHaveURL('/');
  });

  test('TC-016: Back navigation works correctly', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Manage Client');
    await expect(page).toHaveURL('/clientManage');
    
    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  test('TC-017: Direct URL access to protected routes works when authenticated', async ({ page }) => {
    await page.goto('/clientManage');
    await expect(page).toHaveURL('/clientManage');
    
    await page.goto('/addClient');
    await expect(page).toHaveURL('/addClient');
    
    await page.goto('/transactions');
    await expect(page).toHaveURL('/transactions');
  });
});

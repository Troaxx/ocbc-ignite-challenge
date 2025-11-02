// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('TC-049: Mobile view (375px) - Home page displays correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Welcome Back Admin');
    
    const operationBoxes = page.locator('.operations-box-container > div');
    expect(await operationBoxes.count()).toBe(6);
  });

  test('TC-050: Mobile view (375px) - Client Manage page displays correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card');
    await expect(page.locator('.client-card').first()).toBeVisible();
  });

  test('TC-051: Mobile view (375px) - Navigation hamburger menu works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    const hamburger = page.locator('.hamburger');
    await expect(hamburger).toBeVisible();
    
    await hamburger.click();
    
    const navLinks = page.locator('.nav-links.open');
    await expect(navLinks).toBeVisible();
  });

  test('TC-052: Tablet view (768px) - Home page displays correctly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    await expect(page.locator('.operations-container')).toBeVisible();
    
    const operationBoxes = page.locator('.operations-box-container > div');
    expect(await operationBoxes.count()).toBe(6);
  });

  test('TC-053: Tablet view (768px) - Client Manage page displays correctly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card');
    const clientCards = page.locator('.client-card');
    await expect(clientCards.first()).toBeVisible();
  });

  test('TC-054: Tablet view (768px) - Transactions page displays correctly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/transactions');
    await page.waitForSelector('.TransactionsPage');
    
    const searchContainer = page.locator('.search-container, input[placeholder*="Search"]');
    await expect(searchContainer.first()).toBeVisible();
  });

  test('TC-055: Desktop view (1920px) - Home page displays correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/');
    await expect(page.locator('.HomePage')).toBeVisible();
    
    const operationBoxes = page.locator('.operations-box-container > div');
    expect(await operationBoxes.count()).toBe(6);
  });

  test('TC-056: Desktop view (1920px) - Client Manage page displays correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card');
    const clientCards = page.locator('.client-card');
    expect(await clientCards.count()).toBe(5);
  });

  test('TC-057: Desktop view (1920px) - Transactions page displays correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/transactions');
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ClientActionCard');
    
    const clientCards = page.locator('.ClientActionCard');
    expect(await clientCards.count()).toBeGreaterThan(0);
  });

  test('TC-058: Small mobile (320px) - Layout integrity maintained', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    
    await page.goto('/transactions');
    await page.waitForSelector('.TransactionsPage');
    
    const searchContainer = page.locator('.search-container, input[placeholder*="Search"]');
    await expect(searchContainer.first()).toBeVisible();
  });

  test('TC-059: Mobile logout button appears in hamburger menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    await page.click('.hamburger');
    
    const logoutButton = page.locator('.nav-links.open button:has-text("LOGOUT")');
    await expect(logoutButton).toBeVisible();
  });

  test('TC-060: Desktop logout button visible without hamburger', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/');
    
    const logoutButton = page.locator('.logout-button-container button:has-text("LOGOUT")');
    await expect(logoutButton).toBeVisible();
  });
});

// @ts-check
import { test, expect } from '@playwright/test';

test.describe('UI & Responsiveness Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'eladtester@test.test');
    await page.fill('input[type="password"]', 'elad12345678');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('TC-046: Mobile responsiveness - 375px width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card');
    await expect(page.locator('.client-card').first()).toBeVisible();
  });

  test('TC-047: Tablet responsiveness - 768px width', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    await expect(page.locator('.operations-container')).toBeVisible();
    
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card');
    const clientCards = page.locator('.client-card');
    await expect(clientCards.first()).toBeVisible();
  });

  test('TC-048: Desktop responsiveness - 1920px width', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/');
    await expect(page.locator('.HomePage')).toBeVisible();
    
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card');
    const clientCards = page.locator('.client-card');
    expect(await clientCards.count()).toBeGreaterThan(0);
  });

  test('TC-049: Layout integrity on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    
    await page.goto('/transactions');
    await page.waitForSelector('.TransactionsPage');
    
    const searchContainer = page.locator('.search-container, input[placeholder*="Search"]');
    await expect(searchContainer.first()).toBeVisible();
  });

  test('TC-050: Navigation menu accessible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    const operationBoxes = page.locator('.operations-box-container > div');
    expect(await operationBoxes.count()).toBeGreaterThan(0);
  });
});


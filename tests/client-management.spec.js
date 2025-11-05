// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Client Management Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('Client Manage page displays clients', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card', { timeout: 5000 });
    
    const clientCards = page.locator('.client-card');
    expect(await clientCards.count()).toBeGreaterThan(0);
  });

  test('Search client by ID', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card');
    
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    
    const clientCards = page.locator('.client-card');
    expect(await clientCards.count()).toBeGreaterThanOrEqual(1);
  });

  test('Add new client', async ({ page }) => {
    await page.goto('/addClient');
    
    const timestamp = Date.now();
    const newClientId = `TEST${timestamp}`;
    
    await page.fill('input[name="id"]', newClientId);
    await page.fill('input[name="name"]', 'Test Client');
    await page.fill('input[name="age"]', '30');
    await page.fill('input[name="city"]', 'Test City');
    await page.fill('input[name="phone"]', '123-456-7890');
    await page.fill('input[name="cash"]', '1000');
    await page.fill('input[name="credit"]', '500');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/clientManage');
  });

  test('Navigate to single client page', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.manage-button');
    
    await page.locator('.manage-button').first().click();
    
    await expect(page.url()).toMatch(/\/singlePage\/\d+/);
  });

  test('Edit client information', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.manage-button');
    
    await page.locator('.manage-button').first().click();
    
    await page.click('button:has-text("Edit")');
    await page.fill('input[name="name"]', 'Updated Name');
    await page.click('button:has-text("Save")');
    
    await page.waitForTimeout(1000);
    await expect(page.locator('text=Updated Name')).toBeVisible();
  });
});

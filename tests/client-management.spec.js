// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Client Management Tests', () => {
  
  //Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    await page.fill('input[type="email"]', 'eladtester@test.test');
    await page.fill('input[type="password"]', 'elad12345678');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  //Display all clients
  test('Client Manage page displays clients', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card', { timeout: 5000 });
    
    const clientCards = page.locator('.client-card');
    expect(await clientCards.count()).toBeGreaterThan(0);
  });

  //Display searched client information
  test('Search client by ID', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card');
    
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    
    const clientCards = page.locator('.client-card');
    expect(await clientCards.count()).toBeGreaterThanOrEqual(1);
  });

  //Add client information
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

  //Display single client information
  test('Navigate to single client page', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.manage-button');
    
    await page.locator('.manage-button').first().click();
    
    await expect(page.url()).toMatch(/\/singlePage\/\d+/);
  });

  //Edit client information
  test('Edit client information', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.manage-button');
    
    await page.locator('.manage-button').first().click();
    
    // ensure we landed on the single client page
    await expect(page).toHaveURL(/\/singlePage\/\d+/);

    // enter edit mode and update fields
    await page.click('button:has-text("Edit")');
    await page.fill('input[name="name"]', 'Updated Client');
    await page.fill('input[name="city"]', 'Updated City');
    await page.click('button:has-text("Save")');

    // wait for the details area to update and assert the new values are visible
    await page.waitForSelector('.client-details-container');
    // Verify the updated values are present in the details (check text content)
    await expect(page.locator('.client-details-container .value').first()).toHaveText('Updated Client', { timeout: 5000 });
    // Address/City is the 4th value in the details list (0-based index)
    await expect(page.locator('.client-details-container .value').nth(3)).toHaveText('Updated City', { timeout: 5000 });
  });

  //Delete client information
  test('Delete client', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.manage-button');

    await page.locator('.manage-button').first().click();

    // ensure we landed on the single client page
    await expect(page).toHaveURL(/\/singlePage\/\d+/);

    await page.click('button:has-text("Remove Client")');

    await expect(page).toHaveURL('/clientManage');
  });
});

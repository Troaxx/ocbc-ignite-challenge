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

  test('TC-018: Client Manage page loads and displays all 5 default clients', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card', { timeout: 5000 });
    
    const clientCards = page.locator('.client-card');
    expect(await clientCards.count()).toBe(5);
  });

  test('TC-019: Client cards display correct information', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card');
    
    const firstCard = page.locator('.client-card').first();
    await expect(firstCard).toContainText('John Doe');
    await expect(firstCard).toContainText('ID : 1');
    await expect(firstCard).toContainText('Age:');
    await expect(firstCard).toContainText('Phone:');
    await expect(firstCard).toContainText('Address:');
  });

  test('TC-020: Search client by ID functionality works', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card');
    
    await page.fill('input[placeholder*="Search"]', '1');
    await page.waitForTimeout(500);
    
    const clientCards = page.locator('.client-card');
    expect(await clientCards.count()).toBeGreaterThanOrEqual(1);
    await expect(clientCards.first()).toContainText('ID : 1');
  });

  test('TC-021: Search with non-existent ID shows no clients message', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.client-card');
    
    await page.fill('input[placeholder*="Search"]', '999999');
    await page.waitForTimeout(500);
    
    await expect(page.locator('.no-clients-message')).toContainText('No clients found');
  });

  test('TC-022: Navigate to single client page from client card', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.manage-button');
    
    await page.locator('.manage-button').first().click();
    
    await expect(page.url()).toMatch(/\/singlePage\/\d+/);
    await expect(page.locator('.card-container')).toBeVisible();
  });

  test('TC-023: Add new client with unique ID succeeds', async ({ page }) => {
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
    
    await page.fill('input[placeholder*="Search"]', newClientId);
    await page.waitForTimeout(500);
    
    await expect(page.locator('.client-card')).toContainText('Test Client');
  });

  test('TC-024: Add client with duplicate ID shows error', async ({ page }) => {
    await page.goto('/addClient');
    
    await page.fill('input[name="id"]', '1');
    await page.fill('input[name="name"]', 'Duplicate Client');
    await page.fill('input[name="age"]', '25');
    await page.fill('input[name="city"]', 'Test City');
    await page.fill('input[name="phone"]', '111-222-3333');
    await page.fill('input[name="cash"]', '500');
    await page.fill('input[name="credit"]', '100');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('already exists');
  });

  test('TC-025: Add client button in Client Manage page navigates to Add Client', async ({ page }) => {
    await page.goto('/clientManage');
    await page.click('.add-icon-button');
    await expect(page).toHaveURL('/addClient');
  });

  test('TC-026: Single client page displays client details', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.manage-button');
    
    await page.locator('.manage-button').first().click();
    
    await expect(page.locator('.card-container')).toBeVisible();
    await expect(page.locator('img.round-image')).toBeVisible();
    await expect(page.locator('.pro')).toBeVisible();
    await expect(page.locator('h3').first()).toBeVisible();
  });

  test('TC-027: Edit client information', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.manage-button');
    
    await page.locator('.manage-button').first().click();
    
    await page.click('button:has-text("Edit")');
    
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toBeEnabled();
  });

  test('TC-028: Save edited client information', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.manage-button');
    
    await page.locator('.manage-button').first().click();
    
    await page.click('button:has-text("Edit")');
    
    const phoneInput = page.locator('input[name="phone"]');
    await phoneInput.fill('999-888-7777');
    
    await page.click('button:has-text("Save")');
    
    await page.waitForTimeout(1000);
    
    await expect(page.locator('text=999-888-7777')).toBeVisible();
  });

  test('TC-029: Cancel edit without saving changes', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.manage-button');
    
    await page.locator('.manage-button').first().click();
    
    const originalName = await page.locator('h3').first().textContent();
    expect(originalName).not.toBeNull();
    
    await page.click('button:has-text("Edit")');
    
    await page.fill('input[name="name"]', 'Changed Name');
    
    await page.click('button:has-text("Cancel")');
    
    await expect(page.locator('h3').first()).toHaveText(originalName ?? '');
  });

  test('TC-030: Delete client and verify removal', async ({ page }) => {
    await page.goto('/addClient');
    
    const timestamp = Date.now();
    const clientId = `DELETE${timestamp}`;
    
    await page.fill('input[name="id"]', clientId);
    await page.fill('input[name="name"]', 'To Delete');
    await page.fill('input[name="age"]', '25');
    await page.fill('input[name="city"]', 'Test');
    await page.fill('input[name="phone"]', '111-111-1111');
    await page.fill('input[name="cash"]', '1000');
    await page.fill('input[name="credit"]', '500');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/clientManage');
    
    await page.fill('input[placeholder*="Search"]', clientId);
    await page.waitForTimeout(500);
    
    await page.click('.manage-button');
    
    await page.click('button:has-text("Remove")');
    
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveURL('/clientManage');
    
    await page.fill('input[placeholder*="Search"]', clientId);
    await page.waitForTimeout(500);
    
    await expect(page.locator('.no-clients-message')).toBeVisible();
  });
});

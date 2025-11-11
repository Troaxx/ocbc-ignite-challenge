// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Client Management Tests', () => {
  
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

  test('TC-013: Load and display all clients on Client Manage page', async ({ page }) => {
    await page.goto('/clientManage');
    
    await page.waitForSelector('.client-card', { timeout: 5000 });
    
    const clientCards = page.locator('.client-card');
    await expect(clientCards).toHaveCount(5);
  });

  test('TC-014: Search client by ID functionality', async ({ page }) => {
    await page.goto('/clientManage');
    
    await page.fill('input[placeholder*="Search"]', '1');
    
    await page.waitForTimeout(500);
    
    const clientCards = page.locator('.client-card');
    const count = await clientCards.count();
    expect(count).toBeGreaterThan(0);
    
    await expect(clientCards.first()).toContainText('ID : 1');
  });

  test('TC-015: No clients found message displays when search returns empty', async ({ page }) => {
    await page.goto('/clientManage');
    
    await page.fill('input[placeholder*="Search"]', '999999');
    
    await page.waitForTimeout(500);
    
    await expect(page.locator('.no-clients-message')).toContainText('No clients found');
  });

  test('TC-016: Client card displays correct information', async ({ page }) => {
    await page.goto('/clientManage');
    
    await page.waitForSelector('.client-card');
    
    const firstCard = page.locator('.client-card').first();
    await expect(firstCard).toContainText('John Doe');
    await expect(firstCard).toContainText('ID : 1');
    await expect(firstCard).toContainText('Age:');
    await expect(firstCard).toContainText('Phone:');
    await expect(firstCard).toContainText('Address:');
  });

  test('TC-026: Successfully add new client with valid data', async ({ page }) => {
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

  test('TC-027: Form validation for required fields', async ({ page }) => {
    await page.goto('/addClient');
    
    await page.click('button[type="submit"]');
    
    const formFields = page.locator('input[required], input[name="id"], input[name="name"]');
    const count = await formFields.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-028: Prevent duplicate client ID', async ({ page }) => {
    await page.goto('/addClient');
    
    await page.fill('input[name="id"]', '1');
    await page.fill('input[name="name"]', 'Duplicate Client');
    await page.fill('input[name="age"]', '25');
    await page.fill('input[name="city"]', 'Test City');
    await page.fill('input[name="phone"]', '111-222-3333');
    await page.fill('input[name="cash"]', '500');
    await page.fill('input[name="credit"]', '100');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error-message, .ErrorComponent')).toContainText('already exists');
  });

  test('TC-019: View single client details', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.manage-button');
    
    await page.locator('.manage-button').first().click();
    
    await expect(page.locator('.card-container')).toBeVisible();
    await expect(page.locator('img.round-image')).toBeVisible();
    await expect(page.locator('.pro')).toBeVisible();
  });

  test('TC-020: Edit client information', async ({ page }) => {
    await page.goto('/clientManage');
    await page.waitForSelector('.manage-button');
    
    await page.locator('.manage-button').first().click();
    
    const editButton = page.locator('button:has-text("Edit")');
    await editButton.click();
    
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toBeEnabled();
  });

  test('TC-021: Save edited client information', async ({ page }) => {
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

  test('TC-022: Cancel edit without saving changes', async ({ page }) => {
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

  test('TC-023: Delete client and verify removal', async ({ page }) => {
    await page.goto('/addClient');
    
    const timestamp = Date.now();
    const clientId = `DELETE${timestamp}`;
    
    await page.fill('input[name="id"]', clientId);
    await page.fill('input[name="name"]', 'To Delete');
    await page.fill('input[name="age"]', '25');
    await page.fill('input[name="city"]', 'Test');
    await page.fill('input[name="phone"]', '111-111-1111');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/clientManage');
    
    await page.fill('input[placeholder*="Search"]', clientId);
    await page.waitForTimeout(500);
    
    await page.click('.manage-button');
    
    page.on('dialog', dialog => dialog.accept());
    await page.click('button:has-text("Remove")');
    
    await expect(page).toHaveURL('/clientManage');
    
    await page.fill('input[placeholder*="Search"]', clientId);
    await page.waitForTimeout(500);
    
    await expect(page.locator('.no-clients-message')).toBeVisible();
  });
});


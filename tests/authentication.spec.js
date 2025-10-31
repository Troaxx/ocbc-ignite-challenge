// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Authentication & Authorization Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('TC-001: Valid login with correct credentials', async ({ page }) => {
    await expect(page.locator('.login-title')).toHaveText('LOGIN');
    
    await page.fill('input[type="email"]', 'eladtester@test.test');
    await page.fill('input[type="password"]', 'elad12345678');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Welcome Back Admin');
  });

  test('TC-002: Login with any credentials should succeed (mock login)', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'anypassword');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
  });

  test('TC-003: Email validation - invalid format', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalidemail');
    await page.fill('input[type="password"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error-message')).toContainText('valid email');
  });

  test('TC-004: Empty form submission', async ({ page }) => {
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error-message')).toContainText('valid email');
  });

  test('TC-005: Protected route access without authentication redirects to login', async ({ page }) => {
    await page.goto('/');
    
    await expect(page).toHaveURL('/login');
  });

  test('TC-006: Session persistence after page refresh', async ({ page }) => {
    await page.fill('input[type="email"]', 'eladtester@test.test');
    await page.fill('input[type="password"]', 'elad12345678');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
    
    await page.reload();
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Welcome Back Admin');
  });

  test('TC-007: Logout functionality', async ({ page }) => {
    await page.fill('input[type="email"]', 'eladtester@test.test');
    await page.fill('input[type="password"]', 'elad12345678');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
    
    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")');
    if (await logoutButton.count() > 0) {
      await logoutButton.click();
      await expect(page).toHaveURL('/login');
    }
  });
});


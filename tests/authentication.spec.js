// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('TC-001: Login page displays correctly', async ({ page }) => {
    await expect(page.locator('.login-title')).toHaveText('LOGIN');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('TC-002: Successful login with valid email format', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@ocbc.com');
    await page.fill('input[type="password"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Welcome Back Admin');
  });

  test('TC-003: Multiple logins with different valid emails succeed', async ({ page }) => {
    await page.fill('input[type="email"]', 'user1@test.com');
    await page.fill('input[type="password"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
  });

  test('TC-004: Login with any valid email format succeeds', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'anypassword');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
  });

  test('TC-005: Protected routes redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
    
    await page.goto('/clientManage');
    await expect(page).toHaveURL('/login');
    
    await page.goto('/transactions');
    await expect(page).toHaveURL('/login');
  });

  test('TC-006: Session persists after page refresh', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
    
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Welcome Back Admin');
  });

  test('TC-007: Logout functionality works correctly', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
    
    await page.click('button:has-text("LOGOUT")');
    
    await expect(page).toHaveURL('/login');
    
    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });
});

// @ts-check
import { test, expect } from './setup.js';

test.describe('Authentication Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
  });

  test('Login page displays correctly', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Successful login', async ({ page }) => {
    await page.fill('input[type="email"]', 'eladtester@test.test');
    await page.fill('input[type="password"]', 'elad12345678');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Welcome Back Admin');
  });

  test('Login fails with incorrect password', async ({ page }) => {
    await page.fill('input[type="email"]', 'eladtester@test.test');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should stay on login page
    await expect(page).toHaveURL('/login');

    // Should show login error message
    await expect(page.locator('.error-message'))
      .toContainText('Invalid email or password');
  });

  test('Login fails with non-existent account', async ({ page }) => {
    await page.fill('input[type="email"]', 'notexist@test.test');
    await page.fill('input[type="password"]', 'somepassword');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/login');

    await expect(page.locator('.error-message'))
      .toContainText('Invalid email or password');
  });

  test('Shows validation error when fields are empty', async ({ page }) => {
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message'))
      .toContainText('Please enter a valid email address.');

    await expect(page).toHaveURL('/login');
  });

  test('Protected routes redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });

  test('Logout functionality works', async ({ page }) => {
    await page.fill('input[type="email"]', 'eladtester@test.test');
    await page.fill('input[type="password"]', 'elad12345678');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');

    // Make sure the button text matches EXACTLY in your UI
    await page.click('button:has-text("LOGOUT")');

    await expect(page).toHaveURL('/login');
  });
});

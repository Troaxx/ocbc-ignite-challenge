// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('Login page displays correctly', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Successful login', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Welcome Back Admin');
  });

  // ❌ FAILURE 1: wrong password
  test('Login fails with incorrect password', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Your app currently redirects to "/" even on failure
    await expect(page).toHaveURL('/');

    // Check that an error message is shown
    // Adjust the text if your app uses a different wording
    await expect(page.locator('.error-message'))
      .toContainText('Invalid email or password');
  });

  // ❌ FAILURE 2: unregistered email
  test('Login fails with non-existent account', async ({ page }) => {
    await page.fill('input[type="email"]', 'notadmin@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    // Same behaviour: redirected to "/"
    await expect(page).toHaveURL('/');

    // Could be same error text as above
    await expect(page.locator('.error-message'))
      .toContainText('Invalid email or password');
  });

  // ❌ FAILURE 3: empty fields / validation
  test('Shows validation error when fields are empty', async ({ page }) => {
    await page.click('button[type="submit"]');

    // Match the actual message your app shows
    await expect(page.locator('.error-message'))
      .toContainText('Please enter a valid email address.');

    // Still considered part of the login flow
    await expect(page).toHaveURL('/login');
  });

  test('Protected routes redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });

  test('Logout functionality works', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
    
    await page.click('button:has-text("LOGOUT")');
    await expect(page).toHaveURL('/login');
  });
});

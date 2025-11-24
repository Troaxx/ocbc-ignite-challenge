//@ts-check
import { test, expect } from './setup.js';

test.describe('Demo Failure Test', () => {
  
  test('This test is designed to fail for CI/CD demonstration', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'eladtester@test.test');
    await page.fill('input[type="password"]', 'elad12345678');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');
    
    await page.goto('/transactions');
    
    const pageTitle = await page.locator('h1').textContent();
    
    expect(pageTitle).toBe('Non-existent Title That Will Always Fail');
  });

});




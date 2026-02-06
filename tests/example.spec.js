import { test, expect } from '@playwright/test';

const APP_URL = 'http://localhost:5173'; 

test.describe('Portal E2E Authentication', () => {

  // KEEP ONLY THE SECURITY GUARD TEST
  test('Accessing doctor-main without session redirects to login', async ({ page }) => {
    // Attempt to bypass login
    await page.goto(APP_URL + '/doctor-main');

    // Handle the browser alert
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Session expired');
      await dialog.accept();
    });

    // Check if redirected back to loginff
    await expect(page).toHaveURL(/.*login/);
  });

});
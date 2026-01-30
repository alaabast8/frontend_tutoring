import { test, expect } from '@playwright/test';

const APP_URL = 'http://localhost:5173'; // Change to your local dev URL

test.describe('Authentication Flows', () => {

  // Test 1: Successful Student Login to Dashboard
  test('Student can login and see dashboard', async ({ page }) => {
    await page.goto(APP_URL + '/login');
    
    // Ensure Student role is active
    await page.getByRole('button', { name: 'Student' }).click();
    
    await page.locator('#username').fill('student_test');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify navigation to student dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  // Test 2: Doctor Login and Profile Completion Flow
  test('New Doctor is forced to complete profile', async ({ page }) => {
    await page.goto(APP_URL + '/login');
    
    // Switch to Doctor role
    await page.getByRole('button', { name: 'Doctor' }).click();
    
    await page.locator('#username').fill('new_doctor');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify redirected to profile setup
    await expect(page).toHaveURL(/.*doctor-main/);
    await expect(page.getByText('Complete Your Professional Profile')).toBeVisible();

    // Fill the profile form
    await page.locator('#uni_name').fill('Medical University');
    await page.locator('#faculty').fill('General Medicine');
    await page.locator('#department').fill('Surgery');
    await page.locator('#start_teaching_year').fill('2015');
    
    await page.getByRole('button', { name: 'Save Profile & Continue' }).click();

    // Verify success navigation
    await expect(page).toHaveURL(/.*doctor-dashboard/);
  });

  // Test 3: Unauthorized Access Protection
  test('Direct access to doctor-main without login redirects to login', async ({ page }) => {
    // Try to skip login
    await page.goto(APP_URL + '/doctor-main');

    // Page should trigger an alert (handled by page.on('dialog'))
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Session expired');
      await dialog.accept();
    });

    // Should be kicked back to login
    await expect(page).toHaveURL(/.*login/);
  });
});
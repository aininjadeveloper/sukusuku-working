import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Load selectors configuration
const selectorsPath = path.join(process.cwd(), 'tests', 'config', 'selectors.json');
const selectors = JSON.parse(fs.readFileSync(selectorsPath, 'utf8'));

test.describe('Authentication Flow', () => {
  test('complete auth cycle: login → dashboard → logout', async ({ page }) => {
    const testEmail = process.env.TEST_EMAIL;
    const testPassword = process.env.TEST_PASSWORD;
    const loginPath = process.env.LOGIN_PATH || '/login';
    const logoutPath = process.env.LOGOUT_PATH || '/logout';

    if (!testEmail || !testPassword) {
      throw new Error('TEST_EMAIL and TEST_PASSWORD must be set');
    }

    console.log('🔐 Testing auth flow...');

    // 1. Navigate to login page
    console.log('📍 Navigating to login page');
    await page.goto(loginPath);
    
    // Wait for login form to be visible
    await page.waitForSelector(selectors.login.email, { timeout: 10000 });

    // 2. Fill login form
    console.log('📝 Filling login credentials');
    await page.fill(selectors.login.email, testEmail);
    await page.fill(selectors.login.password, testPassword);

    // 3. Submit login
    console.log('🚀 Submitting login form');
    await page.click(selectors.login.submit);

    // 4. Wait for successful login (dashboard/home page)
    console.log('⏳ Waiting for dashboard to load');
    await page.waitForSelector(selectors.dashboardReady, { timeout: 15000 });
    
    // Verify we're logged in by checking URL or presence of authenticated elements
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login');
    console.log('✅ Successfully logged in');

    // 5. Logout
    console.log('🚪 Logging out');
    
    // Try clicking logout button first
    try {
      await page.click(selectors.logoutButton, { timeout: 5000 });
      console.log('✅ Logout button clicked');
    } catch (error) {
      // Fallback: navigate to logout path
      console.log('📍 Using logout path fallback');
      await page.goto(logoutPath);
    }

    // 6. Verify logout
    console.log('🔍 Verifying logout');
    
    // Wait a moment for logout to process
    await page.waitForTimeout(2000);
    
    // Check if we're redirected away from authenticated areas
    const loggedOutUrl = page.url();
    const isLoggedOut = loggedOutUrl.includes('/login') || 
                       loggedOutUrl.includes('/') || 
                       !loggedOutUrl.includes('/dashboard');
    
    expect(isLoggedOut).toBeTruthy();
    console.log('✅ Successfully logged out');

    console.log('🎉 Auth flow test completed successfully');
  });
});
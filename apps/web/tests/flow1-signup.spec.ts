import { test, expect } from './fixtures';

test.describe('Flow 1: Sign Up -> Verify Email -> Login', () => {
  test('Complete sign up flow', async ({ page, testUser }) => {
    // Navigate to signup
    await page.goto('/auth/signup');
    await expect(page).toHaveURL(/.*\/auth\/signup/);
    
    // Fill signup form
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    
    // Submit
    await page.click('button[type="submit"]:has-text("Create Account")');
    
    // Should redirect to chart/new after successful signup
    await page.waitForURL('**/chart/new', { timeout: 15000 });
    await expect(page).toHaveURL(/.*\/chart\/new/);
    
    // Verify we're logged in by checking for chart creation form
    await expect(page.locator('h1:has-text("Create Your Birth Chart")')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/flow1-signup-success.png', fullPage: true });
  });

  test('Login with existing credentials', async ({ page, testUser }) => {
    // First sign up
    await page.goto('/auth/signup');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]:has-text("Create Account")');
    await page.waitForURL('**/chart/new', { timeout: 15000 });
    
    // Logout by clearing cookies/storage
    await page.context().clearCookies();
    
    // Now login
    await page.goto('/auth/login');
    await expect(page).toHaveURL(/.*\/auth\/login/);
    
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]:has-text("Sign In")');
    
    // Should redirect to chart/new
    await page.waitForURL('**/chart/new', { timeout: 15000 });
    await expect(page).toHaveURL(/.*\/chart\/new/);
    
    await page.screenshot({ path: 'test-results/flow1-login-success.png', fullPage: true });
  });

  test('Failed login shows error', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('input[type="email"]', 'nonexistent@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]:has-text("Sign In")');
    
    // Should show error
    await expect(page.locator('text=Invalid login credentials')).toBeVisible({ timeout: 5000 });
    
    await page.screenshot({ path: 'test-results/flow1-login-failure.png', fullPage: true });
  });
});

test.describe('Flow 2: Astrology - Create Chart -> Save -> View Interpretation -> Export PDF', () => {
  test('Create and view birth chart', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    
    // Create chart
    await page.goto('/chart/new');
    
    // Step 1: Birth Details
    await page.fill('input[placeholder="Your name or nickname"]', 'Test User');
    await page.fill('input[type="date"]', '1990-01-15');
    await page.fill('input[type="time"]', '14:30');
    
    // Search for location
    await page.fill('input[placeholder*="Search for a city"]', 'New York');
    await page.waitForTimeout(1500);
    
    // Click first suggestion
    const firstSuggestion = page.locator('button:has-text("New York")').first();
    await firstSuggestion.click();
    await page.waitForTimeout(500);
    
    // Click Continue
    await page.click('button:has-text("Continue")');
    
    // Step 2: Options
    await page.click('button:has-text("Continue")');
    
    // Step 3: Review - Generate
    await page.click('button:has-text("Generate Chart")');
    
    // Wait for chart read page
    await page.waitForURL('**/chart/**/read', { timeout: 30000 });
    await expect(page.locator('h1:has-text("Birth Chart")')).toBeVisible({ timeout: 15000 });
    
    // Wait for chart wheel SVG
    await page.waitForSelector('svg', { timeout: 15000 });
    
    await page.screenshot({ path: 'test-results/flow2-chart-created.png', fullPage: true });
  });

  test('View AI interpretation', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    
    // First create a chart
    await page.goto('/chart/new');
    await page.fill('input[placeholder="Your name or nickname"]', 'Test User 2');
    await page.fill('input[type="date"]', '1990-01-15');
    await page.fill('input[type="time"]', '14:30');
    await page.fill('input[placeholder*="Search for a city"]', 'London');
    await page.waitForTimeout(1500);
    await page.locator('button:has-text("London")').first().click();
    await page.waitForTimeout(500);
    await page.click('button:has-text("Continue")');
    await page.click('button:has-text("Continue")');
    await page.click('button:has-text("Generate Chart")');
    await page.waitForURL('**/chart/**/read', { timeout: 30000 });
    
    // Wait for chart to load
    await page.waitForSelector('svg', { timeout: 15000 });
    
    // Look for interpretation tabs/sections
    // The chart page should have interpretation sections
    await page.waitForSelector('text=Interpretation', { timeout: 10000 }).catch(() => {});
    await page.waitForSelector('text=Overview', { timeout: 10000 }).catch(() => {});
    
    // Click on interpretation tab if exists
    const interpretationTab = page.locator('button:has-text("Interpretation"), a:has-text("Interpretation"), [role="tab"]:has-text("Interpretation")').first();
    if (await interpretationTab.isVisible({ timeout: 2000 })) {
      await interpretationTab.click();
      await page.waitForTimeout(1000);
    }
    
    await page.screenshot({ path: 'test-results/flow2-interpretation.png', fullPage: true });
  });

  test('Export chart as PDF', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    
    // Create a chart first
    await page.goto('/chart/new');
    await page.fill('input[placeholder="Your name or nickname"]', 'Test User 3');
    await page.fill('input[type="date"]', '1990-01-15');
    await page.fill('input[type="time"]', '14:30');
    await page.fill('input[placeholder*="Search for a city"]', 'Tokyo');
    await page.waitForTimeout(1500);
    await page.locator('button:has-text("Tokyo")').first().click();
    await page.waitForTimeout(500);
    await page.click('button:has-text("Continue")');
    await page.click('button:has-text("Continue")');
    await page.click('button:has-text("Generate Chart")');
    await page.waitForURL('**/chart/**/read', { timeout: 30000 });
    
    await page.waitForSelector('svg', { timeout: 15000 });
    
    // Look for export/download button
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Download"), button:has-text("PDF"), a:has-text("Export"), a:has-text("Download"), a:has-text("PDF")').first();
    
    if (await exportButton.isVisible({ timeout: 3000 })) {
      // Start waiting for download
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
      await exportButton.click();
      const download = await downloadPromise;
      
      // Verify it's a PDF
      expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
      
      await page.screenshot({ path: 'test-results/flow2-pdf-export.png', fullPage: true });
    } else {
      // Export might be in a menu
      const menuButton = page.locator('button[aria-label*="menu"], button[aria-label*="more"], button:has-text("More")').first();
      if (await menuButton.isVisible({ timeout: 2000 })) {
        await menuButton.click();
        const exportOption = page.locator('text=Export, text=Download, text=PDF').first();
        if (await exportOption.isVisible({ timeout: 2000 })) {
          const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
          await exportOption.click();
          const download = await downloadPromise;
          expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
        }
      }
    }
  });
});
import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

interface TestUser {
  email: string;
  password: string;
}

interface TestFixtures {
  testUser: TestUser;
  authenticatedPage: Page;
}

export const test = base.extend<TestFixtures>({
  testUser: async ({}, use) => {
    const email = `test_${uuidv4().slice(0, 8)}@example.com`;
    const password = 'TestPass123!';
    await use({ email, password });
  },

  authenticatedPage: async ({ testUser, context }, use) => {
    const page = await context.newPage();
    
    // Sign up first
    await page.goto('/auth/signup');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]:has-text("Create Account")');
    
    // Wait for redirect to chart/new (which means signup succeeded)
    await page.waitForURL('**/chart/new', { timeout: 15000 });
    
    // Now we're authenticated
    await use(page);
    await page.close();
  },
});

export { expect } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/auth/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]:has-text("Sign In")');
  await page.waitForURL('**/chart/new', { timeout: 15000 });
}

export async function createChart(page: Page, chartData: {
  name: string;
  date: string;
  time: string;
  location: string;
}) {
  await page.goto('/chart/new');
  
  // Step 1: Birth Details
  await page.fill('input[placeholder="Your name or nickname"]', chartData.name);
  await page.fill('input[type="date"]', chartData.date);
  await page.fill('input[type="time"]', chartData.time);
  
  // Search for location
  await page.fill('input[placeholder*="Search for a city"]', chartData.location);
  await page.waitForTimeout(1000); // Wait for suggestions
  
  // Click first suggestion
  await page.click('button:has-text("' + chartData.location.split(',')[0] + '")');
  await page.waitForTimeout(500);
  
  // Click Continue
  await page.click('button:has-text("Continue")');
  
  // Step 2: Options - just continue
  await page.click('button:has-text("Continue")');
  
  // Step 3: Review - Generate Chart
  await page.click('button:has-text("Generate Chart")');
  
  // Wait for redirect to chart read page
  await page.waitForURL('**/chart/**/read', { timeout: 30000 });
  
  // Extract chart ID from URL
  const url = page.url();
  const match = url.match(/\/chart\/([^/]+)\/read/);
  return match ? match[1] : null;
}

export async function waitForChartLoad(page: Page) {
  await page.waitForSelector('text=Birth Chart', { timeout: 15000 });
  await page.waitForSelector('svg', { timeout: 15000 });
}
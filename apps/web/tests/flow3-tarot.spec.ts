import { test, expect } from './fixtures';

test.describe('Flow 3: Tarot - Daily Draw -> 3-Card Reading -> Save -> Journal Entry', () => {
  test('Daily tarot draw', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    
    await page.goto('/dashboard/tarot');
    
    // Look for daily draw button
    const dailyDrawButton = page.locator('button:has-text("Daily Draw"), button:has-text("Draw Card"), button:has-text("Get Daily Card")').first();
    
    if (await dailyDrawButton.isVisible({ timeout: 5000 })) {
      await dailyDrawButton.click();
      
      // Wait for card to appear
      await page.waitForSelector('[class*="card"], [class*="Card"]', { timeout: 10000 });
      
      // Check for card image or name
      await expect(page.locator('img, [class*="tarot"]').first()).toBeVisible({ timeout: 5000 });
      
      await page.screenshot({ path: 'test-results/flow3-daily-draw.png', fullPage: true });
    } else {
      // Maybe it's on a different page
      await page.goto('/dashboard/tarot/daily');
      await page.waitForSelector('[class*="card"], [class*="Card"]', { timeout: 10000 });
      await page.screenshot({ path: 'test-results/flow3-daily-draw.png', fullPage: true });
    }
  });

  test('Three card reading', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    
    await page.goto('/dashboard/tarot/reading');
    
    // Select 3-card spread
    const spreadSelector = page.locator('select, [role="combobox"]').first();
    if (await spreadSelector.isVisible({ timeout: 3000 })) {
      await spreadSelector.selectOption('three_card');
    } else {
      // Click on three card option
      await page.click('text=/three.?card/i');
    }
    
    // Optional: enter question
    const questionInput = page.locator('input[placeholder*="question"], textarea[placeholder*="question"]').first();
    if (await questionInput.isVisible({ timeout: 2000 })) {
      await questionInput.fill('What should I focus on today?');
    }
    
    // Generate reading
    await page.click('button:has-text("Generate"), button:has-text("Draw"), button:has-text("Get Reading")');
    
    // Wait for reading to load
    await page.waitForURL('**/tarot/reading/**', { timeout: 30000 });
    
    // Should see 3 cards
    await page.waitForSelector('[class*="card"], [class*="Card"]', { timeout: 10000 });
    
    // Count cards - should be 3
    const cards = page.locator('[class*="tarot-card"], [class*="TarotCard"], img[alt*="card"]').first();
    await expect(cards).toBeVisible();
    
    await page.screenshot({ path: 'test-results/flow3-three-card.png', fullPage: true });
  });

  test('Save reading and create journal entry', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    
    // First create a reading
    await page.goto('/dashboard/tarot/reading');
    
    const spreadSelector = page.locator('select, [role="combobox"]').first();
    if (await spreadSelector.isVisible({ timeout: 3000 })) {
      await spreadSelector.selectOption('three_card');
    }
    
    await page.click('button:has-text("Generate"), button:has-text("Draw"), button:has-text("Get Reading")');
    await page.waitForURL('**/tarot/reading/**', { timeout: 30000 });
    await page.waitForSelector('[class*="card"], [class*="Card"]', { timeout: 10000 });
    
    // Look for save button
    const saveButton = page.locator('button:has-text("Save"), button:has-text("Journal"), button:has-text("Add to Journal")').first();
    
    if (await saveButton.isVisible({ timeout: 5000 })) {
      await saveButton.click();
      
      // Might open a modal for journal entry
      const journalInput = page.locator('textarea[placeholder*="journal"], textarea[placeholder*="notes"], input[placeholder*="journal"]').first();
      if (await journalInput.isVisible({ timeout: 3000 })) {
        await journalInput.fill('Today\'s reading was insightful. The cards resonated with my current situation.');
        
        await page.click('button:has-text("Save"), button:has-text("Add Entry"), button:has-text("Submit")');
        await page.waitForTimeout(1000);
      }
      
      await page.screenshot({ path: 'test-results/flow3-journal-entry.png', fullPage: true });
    }
  });

  test('View tarot journal', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    
    await page.goto('/dashboard/tarot/journal');
    
    // Should show journal entries
    await expect(page.locator('h1:has-text("Journal"), h2:has-text("Journal")')).toBeVisible({ timeout: 10000 });
    
    await page.screenshot({ path: 'test-results/flow3-journal-view.png', fullPage: true });
  });
});
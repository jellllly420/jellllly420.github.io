import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test('listing shows featured post and cards', async ({ page }) => {
    await page.goto('/blog/');
    await expect(page.locator('h1')).toHaveText('Blog');
    // Featured post or at least one link to a blog post should exist
    await expect(page.locator('a[href*="/blog/"]').first()).toBeVisible();
  });

  test('can navigate to a blog post', async ({ page }) => {
    await page.goto('/blog/');
    await page.click('a[href*="/blog/hello"]');
    await expect(page.locator('.post-title')).toContainText('Hello World');
  });

  test('blog post renders prose content', async ({ page }) => {
    await page.goto('/blog/hello-world');
    await expect(page.locator('.post-title')).toContainText('Hello World');
    await expect(page.locator('.prose')).toBeVisible();
  });
});

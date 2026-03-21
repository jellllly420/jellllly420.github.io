import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('shows hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero-name')).toHaveText('Jelly');
    await expect(page.locator('.hero-tagline')).toBeVisible();
  });

  test('shows timeline section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.timeline')).toBeVisible();
  });

  test('timeline nodes are expandable', async ({ page }) => {
    await page.goto('/');
    const node = page.locator('.timeline-node').first();
    await node.scrollIntoViewIfNeeded();
    await node.click();
    await expect(page.locator('.timeline-details').first()).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test('toggles between light and dark mode', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');
    expect(['light', 'dark']).toContain(initialTheme);

    await page.click('.theme-toggle');
    const newTheme = await html.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);
  });

  test('persists theme across page loads', async ({ page }) => {
    await page.goto('/');
    await page.click('.theme-toggle');
    const themeAfterToggle = await page.locator('html').getAttribute('data-theme');

    await page.goto('/blog/');
    const themeAfterNav = await page.locator('html').getAttribute('data-theme');
    expect(themeAfterNav).toBe(themeAfterToggle);
  });
});

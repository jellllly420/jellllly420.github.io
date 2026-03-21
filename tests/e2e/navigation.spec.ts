import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('nav links navigate to correct pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.nav-brand')).toHaveText('Jelly');

    await page.click('a[href="/blog"]');
    await expect(page).toHaveURL(/\/blog\/?$/);
    await expect(page.locator('h1')).toHaveText('Blog');

    await page.click('a[href="/shelf"]');
    await expect(page).toHaveURL(/\/shelf\/?$/);
    await expect(page.locator('h1')).toHaveText('Shelf');

    await page.click('a[href="/travel"]');
    await expect(page).toHaveURL(/\/travel\/?$/);
    await expect(page.locator('h1')).toHaveText('Travel');

    await page.click('a[href="/slides"]');
    await expect(page).toHaveURL(/\/slides\/?$/);
    await expect(page.locator('h1')).toHaveText('Slides');

    await page.click('a[href="/about"]');
    await expect(page).toHaveURL(/\/about\/?$/);
    await expect(page.locator('h1')).toHaveText('About Me');
  });

  test('brand link goes home', async ({ page }) => {
    await page.goto('/blog/');
    await page.click('.nav-brand');
    await expect(page).toHaveURL('/');
  });
});

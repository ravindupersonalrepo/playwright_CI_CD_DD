import { test, expect } from '@fixtures/test-fixtures';

test.describe('Home page', () => {
  test('@smoke should load the home page and expose core navigation', async ({
    page,
    homePage,
    header,
  }) => {
    await homePage.goto();

    await expect(page).toHaveTitle(/Your store/i);
    await expect(header.registerLink).toBeVisible();
    await expect(header.loginLink).toBeVisible();
    await expect(header.shoppingCartLink).toBeVisible();
    await expect(header.searchInput).toBeVisible();
    await expect(homePage.categoryLink('Books')).toBeVisible();
    await expect(homePage.categoryLink('Computers')).toBeVisible();
  });
});

import { test, expect } from '@fixtures/test-fixtures';

test.describe('Books page', () => {
  test.beforeAll(async () => {
    console.log('Starting Books page test suite');
  });

  test.beforeEach(async ({ homePage, booksPage }, testInfo) => {
    console.log(`Starting test: ${testInfo.title}`);
    await homePage.goto();
    await booksPage.expectBooksButtonVisible();
  });

  test.afterEach(async ({}, testInfo) => {
    console.log(`Finished test: ${testInfo.title} - ${testInfo.status}`);
  });

  test.afterAll(async () => {
    console.log('Finished Books page test suite');
  });

  test('@smoke @regression should display the Books button on the home page', async ({
    page,
    booksPage,
  }) => {
    await expect(page).toHaveURL(/\/$/);
    await booksPage.expectBooksButtonVisible();
  });

  test('@regression should open the Books page from the home page', async ({
    page,
    booksPage,
  }) => {
    await booksPage.clickBooksButton();

    await expect(page).toHaveURL(/books/i);
    await booksPage.expectBooksPageVisible();
  });

  test('@regression should keep the Books page visible after reload', async ({
    page,
    booksPage,
  }) => {
    await booksPage.clickBooksButton();
    await expect(page).toHaveURL(/books/i);

    await page.reload();

    await expect(page).toHaveURL(/books/i);
    await booksPage.expectBooksPageVisible();
  });
});




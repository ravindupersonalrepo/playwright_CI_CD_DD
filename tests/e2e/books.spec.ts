import { test, expect } from '@fixtures/test-fixtures';
import { createRandomUser } from '@utils/data-factory';
import { environment } from '@utils/env';

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

  test.skip(
    !environment.runMutatingTests,
    'Set RUN_MUTATING_TESTS=true to enable this mutation test.',
  );

  test('@regression @mutating should add a Books item to the wishlist', async ({
    homePage,
    registerPage,
    header,
    booksPage,
    wishlistPage,
  }) => {
    const user = createRandomUser();

    // Register a new customer
    await registerPage.goto();
    await registerPage.register(user);

    await expect(registerPage.registrationResult).toHaveText(
      'Your registration completed',
    );

    await registerPage.continueAfterRegistration();
    await header.expectLoggedInUser(user.email);

    // Open Books
    await homePage.goto();
    await booksPage.clickBooksButton();

    // Verify the Books page and Fiction category
    await booksPage.expectBooksPageVisible();
    await booksPage.expectFictionVisible();

    // Verify the second product and capture its name
    await expect(booksPage.productItemByIndex(2)).toBeVisible();

    const productName = await booksPage.getProductNameByIndex(2);
    expect(productName).not.toBe('');

    // Add the second product to Wishlist
    await booksPage.addProductToWishlistByIndex(2);

    // Open Wishlist and verify the product
    await header.openWishlist();
    await wishlistPage.expectLoaded();
    await wishlistPage.expectProductInWishlist(productName);
  });

});




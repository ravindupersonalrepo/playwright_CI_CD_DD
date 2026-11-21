import { test, expect } from '@fixtures/test-fixtures';
import { products } from '@data/products';
import { environment } from '@utils/env';
import { createRandomUser } from '@utils/data-factory';

test.describe('Search store journey', () => {
  test.skip(
    !environment.runMutatingTests,
    'This scenario creates a new customer account and adds a product to cart. Set RUN_MUTATING_TESTS=true to enable it.',
  );

  test('@regression @mutating should register, search for Black & White Diamond Heart, and add it to the cart', async ({
    homePage,
    registerPage,
    header,
    searchResultsPage,
    productDetailsPage,
  }) => {
    const user = createRandomUser();
    const productName = products.search.blackAndWhiteDiamondHeart.name;

    await registerPage.goto();
    await registerPage.register(user);

    await expect(registerPage.registrationResult).toHaveText('Your registration completed');
    await registerPage.continueAfterRegistration();

    await homePage.goto();
    await expect(header.searchInput).toBeVisible();
    await searchResultsPage.expectSearchButtonVisible();

    await header.searchFor(productName);

    await searchResultsPage.expectLoaded();
    await searchResultsPage.expectProductListed(productName);
    await searchResultsPage.addProductToCart(productName);

    await productDetailsPage.expectAddedToCartMessage();
    await expect(header.cartQuantityLabel).toContainText('(1)');
  });

  test('@regression @mutating should register, search for Blue and green Sneaker, and add it to the cart', async ({
    homePage,
    registerPage,
    header,
    searchResultsPage,
    productDetailsPage,
  }) => {
    const user = createRandomUser();
    const productName = products.search.blueAndGreenSneaker.name;

    await registerPage.goto();
    await registerPage.register(user);

    await expect(registerPage.registrationResult).toHaveText('Your registration completed');
    await registerPage.continueAfterRegistration();

    await homePage.goto();
    await expect(header.searchInput).toBeVisible();
    await searchResultsPage.expectSearchButtonVisible();

    await header.searchFor(productName);

    await searchResultsPage.expectLoaded();
    await searchResultsPage.expectProductListed(productName);
    await searchResultsPage.addProductToCart(productName);

    await productDetailsPage.expectAddedToCartMessage();
    await expect(header.cartQuantityLabel).toContainText('(1)');
  });
});

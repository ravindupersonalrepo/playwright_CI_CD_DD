import { test, expect } from '@fixtures/test-fixtures';
import { products } from '@data/products';

test.describe('Guest cart journey', () => {
  test('@smoke @regression should allow a guest to search and add a computer to the cart', async ({
    header,
    homePage,
    searchResultsPage,
    productDetailsPage,
    cartPage,
  }) => {
    const product = products.computers.buildYourOwnCheapComputer;

    await homePage.goto();
    await header.searchFor(product.name);

    await searchResultsPage.expectLoaded();
    await searchResultsPage.openProduct(product.name);

    await productDetailsPage.expectProduct(product.name);
    await productDetailsPage.addToCart();
    await productDetailsPage.expectAddedToCartMessage();
    await expect(header.cartQuantityLabel).toContainText('(1)');

    await header.openCart();
    await cartPage.expectLoaded();
    await cartPage.expectProductInCart(product.name);
  });
});

import { test, expect } from '@fixtures/test-fixtures';
import { products } from '@data/products';

test.describe('Currency selector', () => {
  test('@regression should allow a guest to change the display currency', async ({
    header,
    homePage,
    searchResultsPage,
    productDetailsPage,
  }) => {
    const product = products.computers.buildYourOwnCheapComputer;

    await homePage.goto();
    await expect(header.currencySelector).toBeVisible();
    await header.expectSelectedCurrency('US Dollar');

    await header.searchFor(product.name);
    await searchResultsPage.expectLoaded();
    await searchResultsPage.openProduct(product.name);

    await productDetailsPage.expectProduct(product.name);
    const usDollarPrice = await productDetailsPage.getDisplayedPrice();
    expect(usDollarPrice).not.toBe('');

    await header.changeCurrency('Euro');

    await header.expectSelectedCurrency('Euro');
    await productDetailsPage.expectProduct(product.name);

    const euroPrice = await productDetailsPage.getDisplayedPrice();
    expect(euroPrice).not.toBe('');
    expect(euroPrice).not.toBe(usDollarPrice);
  });
});

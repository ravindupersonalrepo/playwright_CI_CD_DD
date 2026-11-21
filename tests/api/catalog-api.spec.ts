import { test, expect } from '@fixtures/test-fixtures';
import { products } from '@data/products';

test.describe('Catalog API responses', () => {
  test('@api @smoke should return the home page response with core catalog content', async ({
    catalogApiClient,
  }) => {
    const { response, html } = await catalogApiClient.getHomePage();

    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('text/html');
    expect(catalogApiClient.hasText(html, 'Computers')).toBeTruthy();
    expect(catalogApiClient.hasText(html, 'Search')).toBeTruthy();
  });

  test('@api @regression should return matching search results for the configured product', async ({
    catalogApiClient,
  }) => {
    const product = products.computers.buildYourOwnCheapComputer;
    const { response, html } = await catalogApiClient.searchProducts(product.name);

    expect(response.ok()).toBeTruthy();
    expect(catalogApiClient.hasText(html, 'Search')).toBeTruthy();
    expect(catalogApiClient.hasText(html, product.name)).toBeTruthy();
  });

  test('@api @regression should expose product details and add-to-cart metadata for the configured product', async ({
    catalogApiClient,
  }) => {
    const product = products.computers.buildYourOwnCheapComputer;
    const { response, html } = await catalogApiClient.getProductPage(product.slug);
    const productId = catalogApiClient.extractAddToCartProductId(html);

    expect(response.ok()).toBeTruthy();
    expect(catalogApiClient.hasText(html, product.name)).toBeTruthy();
    expect(catalogApiClient.hasText(html, 'Add to cart')).toBeTruthy();
    expect(productId).not.toBeNull();
  });
});

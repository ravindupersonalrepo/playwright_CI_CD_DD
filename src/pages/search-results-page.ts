import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '@pages/base-page';

export class SearchResultsPage extends BasePage {
  readonly pageTitle: Locator;
  readonly productList: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.page-title h1');
    this.productList = page.locator('.product-grid, .search-results');
    this.searchButton = page.locator("input[value='Search']");
  }

  productLink(productName: string): Locator {
    return this.page.getByRole('link', { name: productName }).first();
  }

  productItem(productName: string): Locator {
    return this.page.locator('//div[@class="product-item"]').filter({
      has: this.page.locator(`//h2[@class='product-title']//a[normalize-space()="${productName}"]`),
    }).first();
  }

  addToCartButton(productName: string): Locator {
    return this.productItem(productName).locator("//input[@value='Add to cart']");
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toContainText('Search');
  }

  async expectSearchButtonVisible(): Promise<void> {
    await expect(this.searchButton).toBeVisible();
  }

  async expectProductListed(productName: string): Promise<void> {
    await expect(this.productItem(productName)).toBeVisible();
    await expect(this.productLink(productName)).toBeVisible();
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.addToCartButton(productName).click();
  }

  async openProduct(productName: string): Promise<void> {
    await this.productLink(productName).click();
  }
}

import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '@pages/base-page';

export class SearchResultsPage extends BasePage {
  readonly pageTitle: Locator;
  readonly productList: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.page-title h1');
    this.productList = page.locator('.product-grid, .search-results');
  }

  productLink(productName: string): Locator {
    return this.page.getByRole('link', { name: productName }).first();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toContainText('Search');
  }

  async openProduct(productName: string): Promise<void> {
    await this.productLink(productName).click();
  }
}

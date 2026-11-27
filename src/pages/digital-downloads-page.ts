import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '@pages/base-page';

export class DigitalDownloadsPage extends BasePage {
  readonly pageTitle: Locator;
  readonly productItems: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.page-title h1');
    this.productItems = page.locator('.product-item');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText(/Digital Downloads/i);
  }

  productItemByIndex(index: number): Locator {
    return this.productItems.nth(index - 1);
  }

  async getProductNameByIndex(index: number): Promise<string> {
    const name = await this.productItemByIndex(index)
      .locator('.product-title a')
      .innerText();

    return name.trim();
  }

  async addProductToCartByIndex(index: number): Promise<void> {
    await this.productItemByIndex(index)
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }
}
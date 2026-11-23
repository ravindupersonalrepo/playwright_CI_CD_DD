import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '@pages/base-page';

export class WishlistPage extends BasePage {
  readonly pageTitle: Locator;
  readonly productCells: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator('.page-title h1');
    this.productCells = page.locator('td.product');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Wishlist');
  }

  productInWishlist(productName: string): Locator {
    return this.productCells.filter({ hasText: productName });
  }

  async expectProductInWishlist(productName: string): Promise<void> {
    await expect(this.productInWishlist(productName)).toBeVisible();
  }
}
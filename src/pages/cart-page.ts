import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '@pages/base-page';

export class CartPage extends BasePage {
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.page-title h1');
  }

  cartItem(productName: string): Locator {
    return this.page.getByRole('row', { name: new RegExp(productName, 'i') });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toContainText('Shopping cart');
  }

  async expectProductInCart(productName: string): Promise<void> {
    await expect(this.cartItem(productName)).toBeVisible();
  }
}

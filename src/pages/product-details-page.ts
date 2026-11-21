import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '@pages/base-page';

export class ProductDetailsPage extends BasePage {
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly notificationBar: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator('.product-name h1');
    this.productPrice = page.locator('.product-essential [class^="price-value-"]').first();
    this.addToCartButton = page.locator('input[id^="add-to-cart-button-"]');
    this.notificationBar = page.locator('#bar-notification');
  }

  async expectProduct(productName: string): Promise<void> {
    await expect(this.productTitle).toHaveText(productName);
  }

  async getDisplayedPrice(): Promise<string> {
    const priceText = await this.productPrice.textContent();

    return priceText?.trim() ?? '';
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async expectAddedToCartMessage(): Promise<void> {
    await expect(this.notificationBar).toContainText('The product has been added to your shopping cart');
  }
}

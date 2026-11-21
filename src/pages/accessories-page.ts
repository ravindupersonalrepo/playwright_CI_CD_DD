import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '@pages/base-page';

export class AccessoriesPage extends BasePage {
  readonly pageTitle: Locator;
  readonly notificationBar: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.page-title h1');
    this.notificationBar = page.locator('#bar-notification');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toContainText('Accessories');
  }

  productCard(productName: string): Locator {
    return this.page.locator('.product-item').filter({
      has: this.page.getByRole('link', { name: productName, exact: true }),
    });
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async expectAddedToCartMessage(): Promise<void> {
    await expect(this.notificationBar).toContainText('The product has been added to your shopping cart');
  }

  async openShoppingCartFromNotification(): Promise<void> {
    await this.notificationBar.getByRole('link', { name: 'shopping cart' }).click();
  }
}

import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '@pages/base-page';

export class BookPage extends BasePage {
  readonly booksBtn: Locator;
  readonly booksTitle: Locator;
  readonly fictionLink: Locator;
  readonly productItems: Locator;

constructor(page: Page) {
  super(page);
  this.booksBtn = page.getByRole('link', { name: 'Books' }).first();
  this.booksTitle = page.locator('.page-title h1');
  this.fictionLink = page.getByRole('link', { name: 'Fiction', exact: true }).first();
  this.productItems = page.locator('.product-item');
}

async clickBooksButton(): Promise<void> {
    await this.booksBtn.click();
}

async expectBooksButtonVisible(): Promise<void> {
    await expect(this.booksBtn).toBeVisible();
}

async expectBooksPageVisible(): Promise<void> {
    await expect(this.booksTitle).toContainText('Books');
}

  async expectLoaded(): Promise<void> {
    await expect(this.booksTitle).toHaveText('Books');
  }

  async expectFictionVisible(): Promise<void> {
    await expect(this.fictionLink).toBeVisible();
  }

  productItemByIndex(index: number): Locator {
    return this.productItems.nth(index - 1);
  }

  async getProductNameByIndex(index: number): Promise<string> {
    const name = await this.productItemByIndex(index).locator('.product-title a').innerText();
    return name.trim();
  }

  async addProductToWishlistByIndex(index: number): Promise<void> {
    await this.productItemByIndex(index).locator('input[title="Add to wishlist"]').click();
  }

}
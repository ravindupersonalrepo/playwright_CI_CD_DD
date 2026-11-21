import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '@pages/base-page';

export class BookPage extends BasePage {
  readonly booksBtn: Locator;
  readonly booksTitle: Locator;

constructor(page: Page) {
  super(page);
  this.booksBtn = page.getByRole('link', { name: 'Books' }).first();
  this.booksTitle = page.locator('.page-title h1');
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
}
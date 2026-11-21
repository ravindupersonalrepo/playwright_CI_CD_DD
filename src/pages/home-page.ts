import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '@pages/base-page';

export class HomePage extends BasePage {
  readonly featuredProducts: Locator;
  readonly productPriceLabels: Locator;

  constructor(page: Page) {
    super(page);
    this.featuredProducts = page.locator('.product-grid');
    this.productPriceLabels = page.locator('.product-grid .prices');
  }

  async goto(): Promise<void> {
    await this.open('/');
  }

  categoryLink(categoryName: string): Locator {
    return this.page.getByRole('link', { name: categoryName }).first();
  }

  categoryMenuItem(categoryName: string): Locator {
    return this.page.locator('.top-menu > li').filter({
      has: this.page.locator('a').filter({ hasText: categoryName }),
    }).first();
  }

  subcategoryLink(subcategoryName: string): Locator {
    return this.page.locator('.sublist a').filter({ hasText: subcategoryName }).first();
  }

  async hoverCategory(categoryName: string): Promise<void> {
    await this.categoryMenuItem(categoryName).hover();
  }

  async openSubcategory(subcategoryName: string): Promise<void> {
    await this.subcategoryLink(subcategoryName).click();
  }

  async expectProductPricesToContainCurrencySymbol(currencySymbol: string): Promise<void> {
    await expect(this.productPriceLabels.first()).toContainText(currencySymbol);
  }
}

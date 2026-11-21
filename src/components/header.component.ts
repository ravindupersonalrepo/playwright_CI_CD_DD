import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class HeaderComponent {
  readonly registerLink: Locator;
  readonly loginLink: Locator;
  readonly logoutLink: Locator;
  readonly accountLink: Locator;
  readonly shoppingCartLink: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly cartQuantityLabel: Locator;
  readonly currencySelector: Locator;
  readonly selectedCurrencyOption: Locator;

  constructor(private readonly page: Page) {
    this.registerLink = page.getByRole('link', { name: 'Register' }).first();
    this.loginLink = page.getByRole('link', { name: 'Log in' }).first();
    this.logoutLink = page.getByRole('link', { name: 'Log out' }).first();
    this.accountLink = page.locator('.header-links a[href="/customer/info"]').first();
    this.shoppingCartLink = page.getByRole('link', { name: /Shopping cart/i }).first();
    this.searchInput = page.locator('#small-searchterms');
    this.searchButton = page.locator('input.button-1.search-box-button');
    this.cartQuantityLabel = page.locator('.cart-qty').first();
    this.currencySelector = page.locator('#customerCurrency');
    this.selectedCurrencyOption = this.currencySelector.locator('option:checked');
  }

  async searchFor(searchText: string): Promise<void> {
    await this.searchInput.fill(searchText);
    await this.searchButton.click();
  }

  async openCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  async openRegister(): Promise<void> {
    await this.registerLink.click();
  }

  async openLogin(): Promise<void> {
    await this.loginLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async changeCurrency(currencyName: string): Promise<void> {
    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      this.currencySelector.selectOption({ label: currencyName }),
    ]);
  }

  async expectSelectedCurrency(currencyName: string): Promise<void> {
    await expect(this.selectedCurrencyOption).toHaveText(currencyName);
  }

  async expectLoggedInUser(email: string): Promise<void> {
    await expect(this.accountLink).toHaveText(email);
  }
}

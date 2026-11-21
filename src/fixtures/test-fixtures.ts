import { test as base } from '@playwright/test';
import { environment } from '@utils/env';
import { CatalogApiClient } from '@api/clients/catalog-api.client';
import { AccessoriesPage } from '@pages/accessories-page';
import { HeaderComponent } from '@components/header.component';
import { CartPage } from '@pages/cart-page';
import { HomePage } from '@pages/home-page';
import { LoginPage } from '@pages/login-page';
import { ProductDetailsPage } from '@pages/product-details-page';
import { RegisterPage } from '@pages/register-page';
import { SearchResultsPage } from '@pages/search-results-page';
import { BookPage } from '@pages/books-page';

type PageObjects = {
  catalogApiClient: CatalogApiClient;
  header: HeaderComponent;
  accessoriesPage: AccessoriesPage;
  homePage: HomePage;
  registerPage: RegisterPage;
  loginPage: LoginPage;
  searchResultsPage: SearchResultsPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  booksPage: BookPage;
};

export const test = base.extend<PageObjects>({
  catalogApiClient: async ({ playwright }, use) => {
    const apiRequestContext = await playwright.request.newContext({
      baseURL: environment.baseUrl,
      ignoreHTTPSErrors: environment.ignoreHttpsErrors,
    });

    await use(new CatalogApiClient(apiRequestContext));
    await apiRequestContext.dispose();
  },
  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },
  accessoriesPage: async ({ page }, use) => {
    await use(new AccessoriesPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  booksPage: async ({ page }, use) => {
    await use(new BookPage(page));
  },
});

export { expect } from '@playwright/test';


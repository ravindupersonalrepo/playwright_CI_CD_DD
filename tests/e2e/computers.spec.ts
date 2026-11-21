import { test, expect } from '@fixtures/test-fixtures';
import { environment } from '@utils/env';
import { products } from '@data/products';
import { createRandomUser } from '@utils/data-factory';

test.describe('Computers accessories cart journey', () => {
  test.skip(
    !environment.runMutatingTests,
    'This scenario creates test data on the target site. Set RUN_MUTATING_TESTS=true to enable it.',
  );

  test('@regression @mutating should allow a registered customer to add TCP Coaching day from Accessories', async ({
    homePage,
    registerPage,
    header,
    accessoriesPage,
    cartPage,
  }) => {
    const user = createRandomUser();
    const product = products.computers.accessories.tcpCoachingDay;

    await registerPage.goto();
    await registerPage.register(user);

    await expect(registerPage.registrationResult).toHaveText('Your registration completed');
    await registerPage.continueAfterRegistration();
    await header.expectLoggedInUser(user.email);

    await homePage.goto();
    await homePage.hoverCategory('Computers');
    await homePage.openSubcategory('Accessories');

    await accessoriesPage.expectLoaded();
    await accessoriesPage.addProductToCart(product.name);
    await accessoriesPage.expectAddedToCartMessage();
    await accessoriesPage.openShoppingCartFromNotification();

    await cartPage.expectLoaded();
    await cartPage.expectProductInCart(product.name);
  });
});

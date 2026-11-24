import { test, expect } from '@fixtures/test-fixtures';
import { environment } from '@utils/env';
import { createRandomUser } from '@utils/data-factory';

test.describe('Digital downloads cart journey', () => {
  test.skip(
    !environment.runMutatingTests,
    'This scenario registers a customer and adds a product to the cart. Set RUN_MUTATING_TESTS=true to enable it.',
  );

  test('@regression @mutating should add a Digital Downloads product to the cart', { tag: '@codeReview' }, async ({
    page,
    homePage,
    registerPage,
    header,
    digitalDownloadsPage,
    cartPage,
  }) => {
    const user = createRandomUser();

    // Register a new customer
    await registerPage.goto();
    await registerPage.register(user);

    await expect(registerPage.registrationResult).toHaveText(
      'Your registration completed',
    );

    await registerPage.continueAfterRegistration();
    await header.expectLoggedInUser(user.email);

    // Open Digital Downloads
    await homePage.goto();
    await homePage.categoryLink('Digital Downloads').click();

    // Verify the page and identify the selected product
    await digitalDownloadsPage.expectLoaded();

    const productName = await digitalDownloadsPage.getProductNameByIndex(1);
    expect(productName).not.toBe('');

    // Add the product to the cart
    await digitalDownloadsPage.addProductToCartByIndex(1);

    // Open the cart and verify the product
    await header.openCart();
    await cartPage.expectLoaded();
    await cartPage.expectProductInCart(productName);

    // Verify and select the product's remove-from-cart checkbox
    const removeCheckbox = cartPage.removeFromCartCheckbox(productName);
    await expect(removeCheckbox).toBeVisible();
    await removeCheckbox.check();
    await expect(removeCheckbox).toBeChecked();

    // Continue shopping
    await cartPage.continueShopping();
  });
});
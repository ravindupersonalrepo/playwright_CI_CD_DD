import { test, expect } from '@fixtures/test-fixtures';
import { environment } from '@utils/env';
import { createRandomUser } from '@utils/data-factory';

test.describe('Customer registration and login', () => {
  test.skip(
    !environment.runMutatingTests,
    'This scenario creates test data on the target site. Set RUN_MUTATING_TESTS=true to enable it.',
  );

  test('@regression should allow a customer to register and log back in', async ({
    registerPage,
    loginPage,
    header,
  }) => {
    const user = createRandomUser();

    await registerPage.goto();
    await registerPage.register(user);

    await expect(registerPage.registrationResult).toHaveText('Your registration completed');
    await registerPage.continueAfterRegistration();

    await header.expectLoggedInUser(user.email);
    await header.logout();

    await loginPage.goto();
    await loginPage.login(user.email, user.password);

    await header.expectLoggedInUser(user.email);
  });
});

# Playwright TypeScript Automation Framework

End-to-end automation framework for the Demo Web Shop site using Playwright and TypeScript.

## Base URL

`https://new.demowebshop.tricentis.com/`

## What is included

- Playwright Test with TypeScript
- Page object model structure with reusable fixtures
- API client layer for catalog and product endpoint coverage
- Cross-browser projects for bundled Chromium, Firefox, and WebKit
- Dedicated API-only Playwright project for request-based tests
- Playwright HTML, Monocart, and JUnit reporting
- Trace, screenshot, and video capture on failures
- Portable Windows runner scripts for common local commands
- GitHub Actions workflows for code review, smoke, cleanup, and scheduled regression runs

## Project structure

```text
.
├── .env.example
├── .github
│   └── workflows
│       ├── cleanup-code-review-tags.yml
│       ├── code-review-tests.yml
│       ├── main-smoke-tests.yml
│       └── scheduled-regression-tests.yml
├── package.json
├── playwright.config.ts
├── README.md
├── scripts
│   └── run-playwright.cmd
├── src
│   ├── api
│   │   └── clients
│   ├── components
│   ├── data
│   ├── fixtures
│   ├── pages
│   ├── types
│   └── utils
├── tests
│   ├── api
│   ├── e2e
│   └── smoke
└── *.cmd runner files
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install Playwright browsers on Windows with the provided helper:

   ```bat
   install-playwright-browsers.cmd
   ```

   If you prefer the lower-level command, this also works:

   ```bat
   scripts\run-playwright.cmd install chromium ffmpeg
   ```

3. Copy the example environment file if you want local overrides:

   ```powershell
   Copy-Item .env.example .env
   ```

## Environment options

The framework supports these optional environment values:

- `BASE_URL` overrides the site under test
- `CI=true` enables CI-friendly settings such as `forbidOnly` and retries
- `IGNORE_HTTPS_ERRORS=true` allows HTTPS certificate errors only when explicitly needed
- `RUN_MUTATING_TESTS=true` enables scenarios that create persistent test data

By default, mutating tests are disabled to avoid creating accounts repeatedly on a shared environment.

## Test strategy

- `api` runs request-based API coverage without browser projects
- `chromium` uses Playwright's bundled Chromium browser for predictable local and CI execution
- `firefox` and `webkit` use Playwright-managed browsers as separate projects
- API tests use Playwright request contexts to validate catalog, search, and product-detail responses
- A fixed `1440x900` viewport is used across browser projects for deterministic layout behavior
- The register/login scenario is opt-in because it creates a new account on the target application

## Branch and CI flow

- `main` is the stable branch and should only be updated through a pull request from `develop`
- `develop` is the integration branch for completed feature work
- feature work should be created from `develop` using branches such as `feature/search-store`
- feature pull requests into `develop` can tag selected tests with `@codeReview` so CI runs only those review-targeted scenarios
- after a feature pull request is merged into `develop`, the cleanup workflow removes `@codeReview` tags automatically from `develop`
- pull requests from `develop` into `main` run the Chromium smoke suite before merge
- scheduled regression runs execute separately so release pull requests stay fast

## Test tags

- `@smoke` marks fast validation coverage used for `develop` → `main` pull requests
- `@regression` marks broader UI and API coverage used for scheduled CI runs
- `@mutating` marks tests that create or change application data and require `RUN_MUTATING_TESTS=true`
- `@codeReview` is used temporarily on feature branches to run only newly selected review tests before merging into `develop`

### How to use `@codeReview` correctly

Use `@codeReview` only for the new or changed test cases that must run in the feature pull request to `develop`.

Important:

- do not add `@codeReview` inside the test title string like `@smoke` or `@regression`
- do not add `@codeReview` as a separate plain line above the test
- add it as a Playwright tag object argument in the `test(...)` call
- use exactly `@codeReview` with the same spelling and letter case
- add it only on the feature branch when you want CI to target that specific test
- after merge into `develop`, the cleanup workflow removes `@codeReview` automatically

Correct example:

```ts
test('@regression @mutating should register, search for Black & White Diamond Heart', { tag: '@codeReview' }, async ({
  homePage,
  registerPage,
  header,
  searchResultsPage,
  productDetailsPage,
}) => {
  // test steps
});
```

Another correct example:

```ts
test('@smoke @regression should display the Books button on the home page', { tag: '@codeReview' }, async ({
  page,
  booksPage,
}) => {
  // test steps
});
```

Wrong examples:

```ts
test('@regression should register a customer @codeReview', async ({
  page,
}) => {
  // wrong because `@codeReview` is inside the title
});
```

```ts
@codeReview
test('@regression should register a customer', async ({
  page,
}) => {
  // wrong because `@codeReview` is not valid as a standalone line
});
```

## Reporting

- Playwright HTML report is generated in `playwright-report`
- Monocart HTML report is generated in `monocart-report`
- JUnit XML is generated in `test-results\results.xml`
- Windows runner scripts now open the Monocart report automatically after a successful test run
- No Java setup is required for Monocart reporting

## Useful commands

```bash
npm test
npm run test:api
npm run test:smoke
npm run test:mutating
npm run test:headed
npm run test:ui
npm run test:chromium
npm run typecheck
npm run report
```

## Windows runner files

If you prefer local execution on Windows, use these files from the project root:

- `install-playwright-browsers.cmd` installs the local Playwright Chromium browser and ffmpeg for this workstation
- `run-chromium-tests.cmd` runs the full Chromium suite and opens the Monocart report on success
- `run-smoke-tests.cmd` runs smoke-tagged Chromium tests and opens the Monocart report on success
- `run-chromium-headed.cmd` runs the full Chromium suite in a visible browser window and opens the Monocart report on success
- `run-smoke-headed.cmd` runs smoke-tagged Chromium tests in a visible browser window and opens the Monocart report on success
- `run-api-tests.cmd` runs the API suite against the configured base URL with HTTPS-error handling enabled for certificate-intercepted environments and opens the Monocart report on success
- `run-test.cmd` runs any single test file you provide and opens the Monocart report on success
- `open-report.cmd` opens `playwright-report\index.html` directly in your default browser
- `open-monocart-report.cmd` opens `monocart-report\index.html` directly in your default browser

The runner files call `scripts\run-playwright.cmd`, which:

- resolves `node` from `PATH` or the default Windows install folder
- resolves Playwright from `npx` first, then falls back to `pnpm` when available
- uses project-local Playwright browsers via `PLAYWRIGHT_BROWSERS_PATH=0`

If browser download is blocked by a self-signed corporate certificate on this workstation, use `install-playwright-browsers.cmd`. It clears stale Playwright download locks, retries once, and keeps the browser files inside this project folder.

## How to run tests

### Full Chromium suite

```bat
run-chromium-tests.cmd
```

### Smoke tests only

```bat
run-smoke-tests.cmd
```

### API tests only

```bat
run-api-tests.cmd
```

Or run them directly with:

```bat
set IGNORE_HTTPS_ERRORS=true
scripts\run-playwright.cmd test tests\api
```

### Headed Chromium run

```bat
run-chromium-headed.cmd
```

### Run any single test file

```bat
run-test.cmd tests\e2e\currency.spec.ts --headed
```

This generic runner:

- defaults to the Chromium project
- accepts Windows or forward-slash test paths
- forwards any extra Playwright arguments you pass, such as `--headed` or `-g "test name"`
- opens the Monocart report automatically after a successful run

Another example:

```bat
run-test.cmd tests\e2e\guest-cart.spec.ts --headed
```

### Register/login scenario

This scenario is disabled by default because it creates a user account.

Use the generic runner after enabling mutating tests.

Command Prompt:

```bat
set RUN_MUTATING_TESTS=true
run-test.cmd tests\e2e\register-login.spec.ts --headed
```

PowerShell:

```powershell
$env:RUN_MUTATING_TESTS = 'true'
cmd /c "run-test.cmd tests\e2e\register-login.spec.ts --headed"
```

### Open the latest Playwright report

```bat
open-report.cmd
```

This opens the generated HTML file directly and does not start a local report server, so it avoids port conflicts.

### Open the Monocart report

```bat
open-monocart-report.cmd
```

This opens the generated Monocart HTML report directly from `monocart-report\index.html`.

## CI

The project includes these workflow files:

- `/.github/workflows/code-review-tests.yml`
- `/.github/workflows/cleanup-code-review-tags.yml`
- `/.github/workflows/main-smoke-tests.yml`
- `/.github/workflows/scheduled-regression-tests.yml`

### `code-review-tests.yml`

- triggers on pull requests targeting `develop`
- checks whether any tests contain `@codeReview`
- runs only tagged `@codeReview` tests in the Chromium project
- enables mutating tests with `RUN_MUTATING_TESTS=true`
- skips cleanly when no `@codeReview` tests are present
- uploads `code-review-report` with Monocart, Playwright HTML, and JUnit outputs

### `cleanup-code-review-tags.yml`

- triggers after a pull request into `develop` is merged
- removes `@codeReview` tags from test files in `develop`
- commits the cleanup automatically so `develop` does not keep temporary review tags

### `main-smoke-tests.yml`

- triggers on pull requests targeting `main`
- runs the Chromium smoke suite with `@smoke`
- uploads `main-smoke-report`

### `scheduled-regression-tests.yml`

- runs the Chromium regression suite with `@regression`
- runs on a daily schedule at `4:30 PM` Sri Lanka time and `9:30 PM` Sri Lanka time
- also supports manual runs from the GitHub Actions page with `workflow_dispatch`
- uploads `scheduled-regression-report`

## Sample scenarios

- `@smoke @regression` Home page loads and core navigation is visible
- `@smoke @regression` Guest user can search for a product and add it to the cart
- `@smoke @regression` Books button is visible on the home page
- `@regression` Guest user can change the display currency
- `@api @smoke` Catalog home page responds with core content
- `@api @regression` Search endpoint returns the configured product
- `@api @regression` Product details endpoint exposes add-to-cart metadata
- `@regression` Customer can register and log back in when mutating tests are explicitly enabled
- `@regression @mutating` Registered customer can open Computers > Accessories and add TCP Coaching day to the cart

## Framework notes

- Keep selectors inside page and component classes
- Prefer user-visible locators and web-first assertions
- Keep tests focused on business intent rather than UI mechanics
- Use API tests to validate server responses for catalog and product flows without opening a browser
- Isolate test data and make data-creating tests opt-in
- Use CI to keep type safety and core coverage healthy on every change


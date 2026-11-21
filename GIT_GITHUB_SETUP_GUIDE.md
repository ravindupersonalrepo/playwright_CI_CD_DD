# GitHub Push Setup and Troubleshooting Guide

This guide explains how to upload this project to GitHub when you have multiple GitHub accounts on the same machine and may run into Git ownership, wrong-user, or push permission issues.

## When to use this guide

Use this guide if you see issues like:

- `Permission to <owner>/<repo>.git denied to <other-account>`
- `fatal: detected dubious ownership in repository`
- `fatal: repository not found`
- `src refspec main does not match any`
- tests run fine locally, but pushing to GitHub fails

## Recommended clean setup path

If the old project folder has a broken or undeletable `.git` folder, do not keep fighting it.

Use a clean folder such as:

`C:\Users\RavinduSamaraweera\OneDrive - Novigi Pty Ltd\Desktop\DD_Playwright`

Copy the project files into the new folder, but do not copy:

- `.git`
- `node_modules`
- `.pnpm-store`
- `playwright-report`
- `monocart-report`
- `test-results`
- `.env`

Keep these:

- `.gitignore`
- `.env.example`
- `src`
- `tests`
- `scripts`
- `README.md`
- `package.json`
- `pnpm-lock.yaml`
- `playwright.config.ts`
- `tsconfig.json`
- `.cmd` runner files

## Step 1: Open the clean project folder

In Git Bash:

```bash
cd "/c/Users/RavinduSamaraweera/OneDrive - Novigi Pty Ltd/Desktop/DD_Playwright"
```

## Step 2: Initialize Git

```bash
git init
```

## Step 3: Set the local Git user for this repo only

Use the account that owns the destination repository.

Example for personal account:

```bash
git config user.name "ravindupersonalrepo"
git config user.email "ravindu.nimidev@gmail.com"
```

## Step 4: Confirm the local Git user

```bash
git config user.name
git config user.email
```

Expected output:

```text
ravindupersonalrepo
ravindu.nimidev@gmail.com
```

## Step 5: Add and commit the full project

Do not commit only `README.md` for an existing project.

Use:

```bash
git add .
git commit -m "Initial commit"
git branch -M main
```

## Step 6: Add the GitHub remote

Use the exact repository URL.

Example:

```bash
git remote add origin https://github.com/ravindupersonalrepo/playwright_CI_CD_DD.git
```

Then verify:

```bash
git remote -v
```

Expected output:

```text
origin  https://github.com/ravindupersonalrepo/playwright_CI_CD_DD.git (fetch)
origin  https://github.com/ravindupersonalrepo/playwright_CI_CD_DD.git (push)
```

## Important note about the URL

Use:

```text
https://github.com/owner/repo.git
```

Do not intentionally type:

```text
https\://github.com/owner/repo.git
```

If the terminal display shows a backslash unexpectedly but the push still reaches GitHub, the bigger problem is usually authentication, not the display itself.

## Step 7: Push to GitHub

```bash
git push -u origin main
```

## If push fails with 403 denied to the wrong account

Example error:

```text
remote: Permission to ravindupersonalrepo/playwright_CI_CD_DD.git denied to ravindusamaraweera94.
fatal: unable to access ... 403
```

This means:

- your local repo config may be correct
- but Windows or Git is authenticating with the wrong cached GitHub account

### Fix the cached GitHub account

1. Open `Control Panel`
2. Open `Credential Manager`
3. Open `Windows Credentials`
4. Remove GitHub-related entries such as:
   - `git:https://github.com`
   - `github.com`
   - entries related to Git Credential Manager and GitHub
5. Run the push again:

```bash
git push -u origin main
```

6. When prompted, sign in with the correct account:

```text
ravindupersonalrepo
```

## If Git says dubious ownership

Example error:

```text
fatal: detected dubious ownership in repository
```

This usually happens when the `.git` folder was created by a different Windows user or process.

### Best fix

- move the project to a clean new folder
- do not copy the old `.git` folder
- run `git init` again in the new folder

This is cleaner than trying to repair a broken ownership situation.

## If Git says local config cannot be used

Example error:

```text
fatal: --local can only be used inside a git repository
```

Fix:

```bash
git init
git config user.name "ravindupersonalrepo"
git config user.email "ravindu.nimidev@gmail.com"
```

Use `git init` first, then configure the repo.

## If Git says src refspec main does not match any

Example error:

```text
error: src refspec main does not match any
```

This means there is no commit on `main` yet.

Fix:

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

## If Git says remote origin already exists

Fix:

```bash
git remote remove origin
git remote add origin https://github.com/ravindupersonalrepo/playwright_CI_CD_DD.git
git remote -v
```

## Commands for a full clean GitHub setup

Use this full sequence in the clean project folder:

```bash
cd "/c/Users/RavinduSamaraweera/OneDrive - Novigi Pty Ltd/Desktop/DD_Playwright"
git init
git config user.name "ravindupersonalrepo"
git config user.email "ravindu.nimidev@gmail.com"
git config user.name
git config user.email
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ravindupersonalrepo/playwright_CI_CD_DD.git
git remote -v
git push -u origin main
```

## Commands to verify the setup

Check Git user:

```bash
git config user.name
git config user.email
```

Check remote:

```bash
git remote -v
```

Check branch:

```bash
git branch
```

Check status:

```bash
git status
```

## Playwright test execution note

If tests run in the new folder but browser launch fails, install browser binaries with:

```bat
install-playwright-browsers.cmd
```

Then run a test, for example:

```bat
run-test.cmd tests\e2e\currency.spec.ts --headed
```

If a mutating test is skipped, enable it first:

```bat
set RUN_MUTATING_TESTS=true && run-test.cmd tests\e2e\computers.spec.ts --headed
```

## Final checklist

Before pushing, confirm all of these are true:

- project is in the clean new folder
- old `.git` was not copied over
- local Git user is `ravindupersonalrepo`
- remote points to `ravindupersonalrepo/playwright_CI_CD_DD.git`
- cached GitHub login for the wrong account was removed if needed
- push sign-in is done with `ravindupersonalrepo`

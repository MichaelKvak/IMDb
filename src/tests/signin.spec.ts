import { test, expect } from '@playwright/test';
import { SignInPage } from '@pages/SignInPage';
import { AmazonSignInPage } from '@pages/AmazonSignInPage';

const EMAIL = process.env.IMDB_EMAIL!;
const PASSWORD = process.env.IMDB_PASSWORD!;

// Sign-in is slow and triggers bot-detection if repeated — consolidate all
// post-login assertions into one test so Amazon is hit only once per run.
test('Sign in via Amazon', async ({ page }) => {
  // Allow 150 s total — up to 120 s waitForURL covers manual CAPTCHA resolution
  test.setTimeout(150_000);

  const signInPage = new SignInPage(page);
  const amazonSignInPage = new AmazonSignInPage(page);

  await page.goto('/');
  await signInPage.clickSignInHeader();
  await expect(page).toHaveURL(/\/registration\/signin\//);

  await signInPage.clickSignInToExistingAccount();
  await signInPage.clickSignInWithAmazon();
  await expect(page).toHaveURL(/amazon\.com\/ap\/signin/);

  await amazonSignInPage.enterEmail(EMAIL);
  await amazonSignInPage.enterPassword(PASSWORD);

  // If CAPTCHA appears, the long timeout allows manual resolution in headed mode
  await page.waitForURL(/imdb\.com/, { timeout: 120_000 });

  await test.step('should sign in to IMDb using Amazon account', async () => {
    await expect(page.getByRole('link', { name: 'Sign in', exact: true })).not.toBeVisible();
  });

  await test.step('should display username in header after sign in', async () => {
    await expect(page.locator('span.navbar__user-name')).toHaveText('Michael');
  });

  await test.step('should show all account menu items after clicking avatar', async () => {
    await page.locator('label[for="navUserMenu"]').click();

    const accountMenu = page.locator('#navUserMenu-contents');
    await expect(accountMenu).toBeVisible();

    const expectedItems = [
      'Your profile',
      'Your Watchlist',
      'Your ratings',
      'Your lists',
      'Your favorite people',
      'Your interests',
      'Your watch history',
      'Account settings',
      'Sign out',
    ];

    for (const item of expectedItems) {
      await expect(accountMenu.getByText(item, { exact: true })).toBeVisible();
    }
  });
});

test.describe('Redirect after sign in', () => {
  test('should redirect back to watchlist after signing in from protected page', async ({ page }) => {
    test.setTimeout(150_000);

    const signInPage = new SignInPage(page);
    const amazonSignInPage = new AmazonSignInPage(page);

    await page.goto('/list/watchlist/');
    await expect(page).toHaveURL(/\/registration\/signin\/\?u=%2Flist%2Fwatchlist%2F/);

    await signInPage.clickSignInToExistingAccount();
    await signInPage.clickSignInWithAmazon();
    await expect(page).toHaveURL(/amazon\.com\/ap\/signin/);

    await amazonSignInPage.enterEmail(EMAIL);
    await amazonSignInPage.enterPassword(PASSWORD);

    await page.waitForURL(/\/list\/watchlist\//, { timeout: 120_000 });
    await expect(page).toHaveURL(/\/list\/watchlist\//);
  });
});

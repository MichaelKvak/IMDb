import { test, expect } from '@playwright/test';
import { NavBarPage } from '@pages/NavBarPage';

test.describe('Header visibility', () => {
  let navBar: NavBarPage;

  test.beforeEach(async ({ page }) => {
    navBar = new NavBarPage(page);
    await navBar.goto();
  });

  test('all header elements should be visible', async () => {
    await expect(navBar.logo).toBeVisible();
    await expect(navBar.menuButton).toBeVisible();
    await expect(navBar.searchInput).toBeVisible();
    await expect(navBar.searchSubmitButton).toBeVisible();
    await expect(navBar.imdbProLink).toBeVisible();
    await expect(navBar.watchlistLink).toBeVisible();
    await expect(navBar.signInLink).toBeVisible();
    await expect(navBar.languageSelector).toBeVisible();
  });
});

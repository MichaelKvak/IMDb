import { test, expect } from '@playwright/test';
import { SearchPage } from '@pages/SearchPage';

const SEARCH_CATEGORIES = ['All', 'Titles', 'TV episodes', 'Celebs', 'Companies', 'Keywords'];
const QUERY = 'Inception';

test.describe('Search category selector', () => {
  test('dropdown shows all expected categories', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
    await searchPage.openCategoryDropdown();

    for (const category of SEARCH_CATEGORIES) {
      await expect(searchPage.getCategoryOption(category)).toBeVisible();
    }
    await expect(searchPage.getCategoryOption('Advanced search')).toBeVisible();
  });

  for (const category of SEARCH_CATEGORIES) {
    test(`search with category "${category}" returns results`, async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.goto();

      await searchPage.selectCategory(category);
      await expect(searchPage.categorySelectorButton).toContainText(category);

      await searchPage.search(QUERY);

      expect(page.url()).toContain('/find/');
      expect(page.url()).toContain('Inception');
      await expect(page.getByRole('heading', { name: /search/i, level: 1 })).toBeVisible();
    });
  }
});

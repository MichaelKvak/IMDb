import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { MovieDetailsPage } from '../pages/MovieDetailsPage';

/**
 * Test Case 1 – Search and Validate Movie
 *
 * Flow:
 *  1. Navigate to the IMDb homepage.
 *  2. Type "Inception" into the global search bar.
 *  3. Wait for typeahead suggestions and click the first result.
 *  4. Assert that the movie title on the details page matches the search keyword.
 */
test.describe('Search and Validate Movie', () => {
  const SEARCH_QUERY = 'Inception';

  test('should display the correct movie title on the details page after searching', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const movieDetailsPage = new MovieDetailsPage(page);

    // Step 1: Navigate to the IMDb homepage
    await homePage.goto();

    // Step 2: Type the movie title into the search bar
    await homePage.typeSearchQuery(SEARCH_QUERY);

    // Step 3: Wait for suggestions and click the first matching result.
    //         The first suggestion is the best match (Inception 2010).
    await expect(homePage.getSuggestions().first()).toBeVisible();
    await homePage.clickFirstSuggestion(/inception/i);

    // Wait for the movie details page to load
    await movieDetailsPage.waitForPageLoad();

    // Step 4: Validate – the title on the details page matches the search keyword
    const titleText = await movieDetailsPage.getMovieTitle();
    expect(titleText.toLowerCase()).toContain(SEARCH_QUERY.toLowerCase());
  });
});

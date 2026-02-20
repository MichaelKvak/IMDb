import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { Top250Page } from '../pages/Top250Page';
import { MovieDetailsPage } from '../pages/MovieDetailsPage';
import { extractRating, isValidYear } from '../utils';

/**
 * Test Case 2 – Navigate Top 250 Movies
 *
 * Flow:
 *  1. Go to the IMDb homepage and navigate to Top 250 Movies via the menu.
 *  2. Click on the first movie in the list.
 *  3. Assert:
 *     a. Movie title is visible.
 *     b. IMDb rating is displayed (numeric value between 1–10).
 *     c. Year of release is shown (valid four-digit year).
 */
test.describe('Navigate Top 250 Movies', () => {
  test('should show title, rating, and release year for the first Top 250 movie', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const top250Page = new Top250Page(page);
    const movieDetailsPage = new MovieDetailsPage(page);

    // Step 1a: Navigate to the IMDb homepage
    await homePage.goto();

    // Step 1b: Click "Top 250 Movies" from the header navigation
    await homePage.goToTop250Movies();

    // Confirm we landed on the correct page
    await expect(top250Page.pageHeading).toBeVisible();

    // Capture the title of the first movie before clicking (for later assertion)
    const firstMovieTitle = await top250Page.getMovieTitleAtIndex(0);
    expect(firstMovieTitle.length).toBeGreaterThan(0);

    // Step 2: Click on the first movie in the list
    await top250Page.clickMovieAtIndex(0);

    // Wait for the movie details page to load
    await movieDetailsPage.waitForPageLoad();

    // --- Assertions ---

    // 3a: Movie title is visible
    await expect(movieDetailsPage.movieTitle).toBeVisible();
    const titleText = await movieDetailsPage.getMovieTitle();
    expect(titleText.trim().length).toBeGreaterThan(0);

    // 3b: Rating is displayed with a valid numeric value
    await expect(movieDetailsPage.aggregateRatingScore).toBeVisible();
    const rawRating = await movieDetailsPage.getRatingText();
    const ratingValue = extractRating(rawRating);
    expect(ratingValue).not.toBeNull();
    expect(ratingValue!).toBeGreaterThanOrEqual(1);
    expect(ratingValue!).toBeLessThanOrEqual(10);

    // 3c: Year of release is shown and is a valid year
    await expect(movieDetailsPage.releaseYearLink).toBeVisible();
    const yearText = await movieDetailsPage.getReleaseYear();
    expect(isValidYear(yearText)).toBe(true);
  });
});

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for an individual IMDb movie details page.
 * e.g. https://www.imdb.com/title/tt1375666/ (Inception)
 *
 * Exposes getters for the key elements validated in tests:
 *  - Movie title (H1 via data-testid="hero__primary-text")
 *  - IMDb aggregate rating
 *  - Year of release
 */
export class MovieDetailsPage extends BasePage {
 
  readonly movieTitle: Locator;

  readonly aggregateRatingScore: Locator;

  readonly releaseYearLink: Locator;

  constructor(page: Page) {
    super(page);

    this.movieTitle = page.locator('[data-testid="hero__primary-text"]');

    this.aggregateRatingScore = page
      .locator('[data-testid="hero-rating-bar__aggregate-rating__score"]')
      .first();

    this.releaseYearLink = page
      .locator('[data-testid="hero__pageTitle"] ~ ul a')
      .first();
  }

  /** Get the visible movie title text. */
  async getMovieTitle(): Promise<string> {
    return (await this.movieTitle.textContent()) ?? '';
  }

  async getRatingText(): Promise<string> {
    return (await this.aggregateRatingScore.textContent()) ?? '';
  }

  /** Get the release year text (e.g. "2010"). */
  async getReleaseYear(): Promise<string> {
    return ((await this.releaseYearLink.textContent()) ?? '').trim();
  }

  /** Returns true when the rating score element is present in the viewport. */
  async isRatingVisible(): Promise<boolean> {
    return this.aggregateRatingScore.isVisible();
  }

  /** Returns true when the release year link is visible. */
  async isReleaseYearVisible(): Promise<boolean> {
    return this.releaseYearLink.isVisible();
  }
}

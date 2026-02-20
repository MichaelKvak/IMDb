import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the IMDb Top 250 Movies chart page.
 * https://www.imdb.com/chart/top/
 *
 * Each row is an <li class="ipc-metadata-list-summary-item"> containing:
 *   - Link[0]: poster image link (no textContent, aria-label="View title page for …")
 *   - Link[1]: title text link (<h3> inside, textContent = movie title)
 *   - data-testid="ratingGroup--imdb-rating": rating text e.g. "9.3 (3.2M)"
 *   - data-testid="title-list-item-ranking": rank label e.g. "#1"
 */
export class Top250Page extends BasePage {
  /** The page heading ("IMDb Top 250 movies"). */
  readonly pageHeading: Locator;

  /** All movie list-item rows on the chart. */
  private readonly movieListItems: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: /IMDb Top 250 movies/i });
    this.movieListItems = page.locator('li.ipc-metadata-list-summary-item');
  }

  /** Navigate directly to the Top 250 chart. */
  async goto(): Promise<void> {
    await this.page.goto('/chart/top/');
    await this.waitForPageLoad();
  }

  /** Returns the Locator for the nth movie row (0-indexed). */
  getMovieCard(index: number): Locator {
    return this.movieListItems.nth(index);
  }

  /** Returns the total number of movies currently rendered in the list. */
  async getMovieCount(): Promise<number> {
    return this.movieListItems.count();
  }

  /**
   * Returns the title link for the nth row.
   */
  getTitleLink(index: number): Locator {
    return this.getMovieCard(index).getByRole('heading').locator('..').filter({ has: this.page.locator('a') }).locator('a').first();
  }

  /**
   * Click on the title link of the nth movie in the list (0-indexed).
   */
  async clickMovieAtIndex(index: number): Promise<void> {
    // The title link is the second <a> in the row (first is the poster)
    await this.getMovieCard(index).locator('a').nth(1).click();
    await this.waitForPageLoad();
  }

  /**
   * Returns the title text of the nth movie (0-indexed) without navigating.
   * Uses the <h3> heading inside the row which directly contains the title.
   */
  async getMovieTitleAtIndex(index: number): Promise<string> {
    return ((await this.getMovieCard(index).getByRole('heading').textContent()) ?? '').trim();
  }
}

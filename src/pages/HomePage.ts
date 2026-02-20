import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for the IMDb homepage (https://www.imdb.com).
 *
 * Responsible for:
 *  - Navigating to the homepage
 *  - Interacting with the global search bar
 *  - Navigating to top-level sections via the main menu
 */
export class HomePage extends BasePage {
  private readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByLabel('Search IMDb');
  }

  /** Navigate to the IMDb homepage. */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Type a query into the search bar.
   */
  async typeSearchQuery(query: string): Promise<void> {
    await this.searchInput.click();
    await this.searchInput.fill(query);
  }

  /**
   * Returns all visible typeahead suggestion options.
   */
  getSuggestions(): Locator {
    return this.page.getByRole('option');
  }

  /**
   * Click the first typeahead suggestion that matches the given text pattern.
   * Falls back to the very first suggestion when no pattern is provided.
   */
  async clickFirstSuggestion(namePattern?: RegExp): Promise<void> {
    const suggestions = this.getSuggestions();
    if (namePattern) {
      await suggestions.filter({ hasText: namePattern }).first().click();
    } else {
      await suggestions.first().click();
    }
  }

  /**
   * Navigate to the Top 250 Movies page.
   */
  async goToTop250Movies(): Promise<void> {
    await this.page.goto('/chart/top/');
    await this.waitForPageLoad();
  }
}

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NavBarPage extends BasePage {
  readonly logo: Locator;
  readonly menuButton: Locator;
  readonly searchInput: Locator;
  readonly searchSubmitButton: Locator;
  readonly imdbProLink: Locator;
  readonly watchlistLink: Locator;
  readonly signInLink: Locator;
  readonly languageSelector: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = page.getByRole('link', { name: 'Home' });
    this.menuButton = page.getByLabel('Open navigation drawer');
    this.searchInput = page.getByLabel('Search IMDb');
    this.searchSubmitButton = page.getByRole('button', { name: 'Submit search' });
    this.imdbProLink = page.getByRole('link', { name: 'Go To IMDb Pro' });
    this.watchlistLink = page.getByRole('link', { name: 'Watchlist', exact: true });
    this.signInLink = page.getByRole('link', { name: 'Sign in' }).first();
    this.languageSelector = page.locator('label[for="nav-language-selector"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageLoad();
  }
}

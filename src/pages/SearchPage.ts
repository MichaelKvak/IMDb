import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  readonly categorySelectorButton: Locator;
  readonly searchInput: Locator;
  readonly searchSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.categorySelectorButton = page.getByTestId('category-selector-button');
    this.searchInput = page.getByLabel('Search IMDb');
    this.searchSubmitButton = page.getByRole('button', { name: 'Submit search' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageLoad();
  }

  async openCategoryDropdown(): Promise<void> {
    await this.categorySelectorButton.click();
  }

  getCategoryOption(name: string): Locator {
    return this.page.getByRole('menuitem', { name, exact: true });
  }

  async selectCategory(name: string): Promise<void> {
    await this.openCategoryDropdown();
    await this.getCategoryOption(name).click();
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchSubmitButton.click();
    await this.waitForPageLoad();
  }
}

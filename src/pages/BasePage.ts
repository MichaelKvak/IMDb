import { Page } from '@playwright/test';

/**
 * Base class for all page objects.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  getCurrentUrl(): string {
    return this.page.url();
  }
}

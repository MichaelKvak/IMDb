import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignInPage extends BasePage {
  private readonly signInHeaderLink: Locator;
  private readonly signInToExistingAccountButton: Locator;
  private readonly signInWithAmazonLink: Locator;

  constructor(page: Page) {
    super(page);
    this.signInHeaderLink = page.locator('a.imdb-header__signin-text');
    this.signInToExistingAccountButton = page.getByTestId('navigate_to_sign_in_button');
    this.signInWithAmazonLink = page.getByTestId('sign_in_option_AMAZON_AAP');
  }

  async clickSignInHeader(): Promise<void> {
    await this.signInHeaderLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickSignInToExistingAccount(): Promise<void> {
    await this.signInToExistingAccountButton.click();
    await this.signInWithAmazonLink.waitFor({ state: 'visible' });
  }

  async clickSignInWithAmazon(): Promise<void> {
    await this.signInWithAmazonLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

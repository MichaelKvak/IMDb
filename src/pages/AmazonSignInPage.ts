import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AmazonSignInPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly continueButton: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole('textbox', { name: 'Enter mobile number or email' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.continueButton.click();
    await this.passwordInput.waitFor({ state: 'visible' });
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}

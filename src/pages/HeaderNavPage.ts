import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HeaderNavPage extends BasePage {
  readonly panel: Locator;
  readonly closeButton: Locator;
  private readonly menuTrigger: Locator;

  constructor(page: Page) {
    super(page);
    const drawer = page.locator('aside.hamburger__drawer');
    this.menuTrigger = page.locator('label[aria-label="Open navigation drawer"]');
    this.panel = drawer.locator('[data-testid="panel"]');
    this.closeButton = drawer.locator('label.drawer__panelHeaderClose');
  }

  async openMenu(): Promise<void> {
    await this.menuTrigger.click();
  }

  async closeMenu(): Promise<void> {
    await this.closeButton.click();
  }

  async expandSection(sectionTitle: string): Promise<void> {
    const label = this.panel
      .locator('[data-testid="category-expando"]')
      .filter({ hasText: sectionTitle });
    await label.scrollIntoViewIfNeeded();
    await label.waitFor({ state: 'visible' });
    await label.click();
  }

  getSectionHeadings(): Locator {
    return this.panel.locator('span.navlinkcat__itemTitle');
  }

  getNavLinksInSection(sectionTitle: string): Locator {
    return this.panel
      .locator('span.navlinkcat__targetWrapper')
      .filter({ hasText: sectionTitle })
      .locator('a.nav-link');
  }

  getNavLinkByText(text: string): Locator {
    return this.panel.locator('a.nav-link', { hasText: text });
  }
}

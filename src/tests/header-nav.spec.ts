import { test, expect } from '@playwright/test';
import { HeaderNavPage } from '@pages/HeaderNavPage';
import {
  SECTION_HEADINGS,
  MOVIES_LINKS,
  TV_SHOWS_LINKS,
  WATCH_LINKS,
  AWARDS_EVENTS_LINKS,
  CELEBS_LINKS,
  COMMUNITY_LINKS,
} from '@data/header-nav.data';

test.describe('Header Navigation Drawer', () => {
  let nav: HeaderNavPage;

  test.beforeEach(async ({ page }) => {
    nav = new HeaderNavPage(page);
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should be closed by default', async () => {
    await expect(nav.panel).toHaveAttribute('aria-hidden', 'true');
  });

  test('should open when hamburger menu is clicked', async () => {
    await nav.openMenu();
    await expect(nav.panel).toHaveAttribute('aria-hidden', 'false');
  });

  test('should close when close button is clicked', async () => {
    await nav.openMenu();
    await expect(nav.panel).toHaveAttribute('aria-hidden', 'false');
    await nav.closeMenu();
    await expect(nav.panel).toHaveAttribute('aria-hidden', 'true');
  });

  test('should display all section headings', async () => {
    await nav.openMenu();
    const headings = nav.getSectionHeadings();
    await expect(headings).toHaveCount(SECTION_HEADINGS.length);
    for (const heading of SECTION_HEADINGS) {
      await expect(headings.filter({ hasText: heading })).toBeVisible();
    }
  });

  test('should display all Movies section links when expanded', async () => {
    await nav.openMenu();
    await nav.expandSection('Movies');
    const links = nav.getNavLinksInSection('Movies');
    await expect(links).toHaveCount(MOVIES_LINKS.length);
    for (const label of MOVIES_LINKS) {
      await expect(links.filter({ hasText: label })).toBeVisible();
    }
  });

  test('should display all TV shows section links when expanded', async () => {
    await nav.openMenu();
    await nav.expandSection('TV shows');
    const links = nav.getNavLinksInSection('TV shows');
    await expect(links).toHaveCount(TV_SHOWS_LINKS.length);
    for (const label of TV_SHOWS_LINKS) {
      await expect(links.filter({ hasText: label })).toBeVisible();
    }
  });

  test('should display all Watch section links when expanded', async () => {
    await nav.openMenu();
    await nav.expandSection('Watch');
    const links = nav.getNavLinksInSection('Watch');
    await expect(links).toHaveCount(WATCH_LINKS.length);
    for (const label of WATCH_LINKS) {
      await expect(links.filter({ hasText: label })).toBeVisible();
    }
  });

  test('should display all Awards & events section links when expanded', async () => {
    await nav.openMenu();
    await nav.expandSection('Awards & events');
    const links = nav.getNavLinksInSection('Awards & events');
    await expect(links).toHaveCount(AWARDS_EVENTS_LINKS.length);
    for (const label of AWARDS_EVENTS_LINKS) {
      await expect(links.filter({ hasText: label })).toBeVisible();
    }
  });

  test('should display all Celebs section links when expanded', async () => {
    await nav.openMenu();
    await nav.expandSection('Celebs');
    const links = nav.getNavLinksInSection('Celebs');
    await expect(links).toHaveCount(CELEBS_LINKS.length);
    for (const label of CELEBS_LINKS) {
      await expect(links.filter({ hasText: label })).toBeVisible();
    }
  });

  test('should display all Community section links when expanded', async () => {
    await nav.openMenu();
    await nav.expandSection('Community');
    const links = nav.getNavLinksInSection('Community');
    await expect(links).toHaveCount(COMMUNITY_LINKS.length);
    for (const label of COMMUNITY_LINKS) {
      await expect(links.filter({ hasText: label })).toBeVisible();
    }
  });
});

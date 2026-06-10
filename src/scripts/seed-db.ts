import { chromium } from '@playwright/test';
import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'imdb_top25.db');
const TOP_N = 25;

async function seed() {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: false,
    args: [
      '--disable-infobars',
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  await page.goto('https://www.imdb.com/chart/top/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('li.ipc-metadata-list-summary-item', { timeout: 15000 });

  const movies = await page.evaluate((topN: number) => {
    const items = Array.from(document.querySelectorAll('li.ipc-metadata-list-summary-item')).slice(0, topN);
    return items.map((item: Element) => {
      const rankText = item.querySelector('[data-testid="title-list-item-ranking"]')?.textContent?.trim() ?? '';
      const rank = parseInt(rankText.replace('#', '')) || 0;
      const title = item.querySelector('h3')?.textContent?.trim() ?? '';
      const ratingText = item.querySelector('[data-testid="ratingGroup--imdb-rating"] span')?.textContent?.trim() ?? '';
      const rating = parseFloat(ratingText) || null;
      const metaItems = Array.from(item.querySelectorAll('.cli-title-metadata-item'));
      const year = parseInt(metaItems[0]?.textContent?.trim() ?? '') || null;
      return { rank, title, rating, year };
    });
  }, TOP_N);

  await browser.close();
  console.log(`Scraped ${movies.length} movies.`);

  const db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      rank    INTEGER PRIMARY KEY,
      title   TEXT    NOT NULL,
      rating  REAL,
      year    INTEGER
    )
  `);

  db.exec('DELETE FROM movies');

  const insert = db.prepare('INSERT INTO movies (rank, title, rating, year) VALUES (?, ?, ?, ?)');
  for (const m of movies) {
    insert.run(m.rank, m.title, m.rating, m.year);
  }

  db.close();
  console.log(`Database saved to: ${DB_PATH}`);
  movies.forEach(m => console.log(`  #${m.rank} ${m.title} (${m.year}) — ${m.rating}`));
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

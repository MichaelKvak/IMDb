import { test, expect } from '@playwright/test';
import Database from 'better-sqlite3';
import path from 'path';
import { isValidYear } from '@utils/index';

const DB_PATH = path.join(process.cwd(), 'imdb_top25.db');

interface Movie {
  rank: number;
  title: string;
  rating: number | null;
  year: number | null;
}

test.describe('DB: IMDb Top 25 movies', () => {
  let movies: Movie[];

  test.beforeAll(() => {
    const db = new Database(DB_PATH, { readonly: true });
    movies = db.prepare('SELECT * FROM movies ORDER BY rank').all() as Movie[];
    db.close();
  });

  test('should contain at least 25 records', () => {
    expect(movies.length).toBeGreaterThanOrEqual(25);
  });

  test('every movie should have a valid release year', () => {
    const missing = movies.filter(m => m.year === null || !isValidYear(String(m.year)));
    expect(missing, `Movies missing valid year: ${missing.map(m => m.title).join(', ')}`).toHaveLength(0);
  });

  test('should contain more than 1 movie released before 2000', () => {
    const before2000 = movies.filter(m => m.year !== null && m.year < 2000);
    expect(before2000.length).toBeGreaterThan(1);
  });
});

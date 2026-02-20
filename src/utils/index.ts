/**
 * Checks whether a string looks like a valid IMDb rating value.
 * A valid rating is a number between 1.0 and 10.0 (one decimal place),
 * which may be embedded inside a longer string (e.g. "8.8/10").
 */
export function extractRating(rawText: string): number | null {
  const match = rawText.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const value = parseFloat(match[1]);
  return value >= 1 && value <= 10 ? value : null;
}

/**
 * Checks whether a string looks like a valid four-digit release year
 * within a reasonable movie-production range.
 */
export function isValidYear(text: string): boolean {
  const year = parseInt(text.trim(), 10);
  return !isNaN(year) && year >= 1888 && year <= new Date().getFullYear() + 5;
}

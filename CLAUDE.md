# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test                        # Run all tests (headless)
npm run test:headed             # Run all tests with visible browser
npm run test:search             # Run only search.spec.ts
npm run test:top250             # Run only top250.spec.ts
npm run report                  # Open HTML test report
npx playwright test --grep "pattern"  # Run tests matching a name pattern
```

## Architecture

This is a **Playwright E2E test suite** for the live IMDb website, written in TypeScript using the **Page Object Model (POM)** pattern.

### Structure

- `src/pages/` — Page Object classes. `BasePage.ts` is the abstract base; `HomePage`, `Top250Page`, and `MovieDetailsPage` extend it.
- `src/tests/` — Playwright test specs. Each spec imports page objects and orchestrates user flows.
- `src/utils/index.ts` — Pure helper functions: `extractRating()` and `isValidYear()`.

### Key Design Decisions

- **Sequential execution** (`workers: 1`) — intentional to avoid IMDb rate-limiting.
- **Anti-bot headers and Chrome flags** — configured in `playwright.config.ts` to reduce detection (`--disable-blink-features=AutomationControlled`, custom user-agent headers).
- **Path aliases** — `@pages/*` and `@utils/*` are configured in `tsconfig.json`; use these in imports.
- **Retries**: 1 retry on CI; screenshots on failure; video on first retry.
- **Base URL** is hardcoded as `https://www.imdb.com` in `playwright.config.ts`.

# Playwright E2E tests

End-to-end coverage for Burj-Goal: empty state, add / complete / reopen / delete goals, and `localStorage` persistence (`burj-goal:v1`).

## Prerequisites

```bash
npm install
npx playwright install chromium
```

## Commands

```bash
# Run the suite (builds + starts the app unless one is already running)
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# Headed browser
npm run test:e2e:headed

# Open the last HTML report
npx playwright show-report
```

On CI, set `CI=1` so Playwright does not reuse an existing server and applies retries / single worker (see `playwright.config.ts`).

## Layout

```
tests/
  README.md           # this file
  e2e/                # Playwright specs (`testDir`)
  fixtures/           # extended `test` / `expect` + app open helpers
  pages/              # thin page objects
  screenshots/        # opt-in README screenshot capture
```

- Put new user flows in `e2e/*.spec.ts`.
- Prefer page-object methods for repeated UI actions; keep one-off assertions in the spec.
- Shared setup (storage clear/seed, navigation) belongs in `fixtures/` or the page object.

## README screenshot

Regenerate the committed hero image when the UI or layout changes:

```bash
npm run docs:screenshot
```

This runs Playwright with [`playwright.screenshot.config.ts`](../playwright.screenshot.config.ts) (port 3001, production build), seeds demo goals, and writes [`docs/burj-goal.png`](../docs/burj-goal.png). The PNG is committed to the repo — it is **not** produced by git hooks.

## Selector strategy

Prefer accessibility locators:

- `getByRole`, `getByLabel`, `getByText`
- Existing labels: “New goal”, “Add floor”, `aria-label="Goals"`, toggle/delete `aria-label`s, tower `aria-label="Goal tower"`
- Floor nodes: `[data-floor="N"]`

Avoid CSS-module class names — they are brittle and not part of the public UI contract.

## Isolation

[`lib/useTasks.ts`](../lib/useTasks.ts) keeps an in-memory cache backed by `localStorage`. Isolate carefully:

- **Empty start:** `GoalPage.goto` clears storage via `evaluate`, then `reload()` so the module re-reads.
- **Seeded start:** `GoalPage.gotoWithTasks` uses `addInitScript` to set `burj-goal:v1` **before** app JS runs, then `goto('/')`.

Do **not** use a persistent `addInitScript` that *clears* storage — it would also wipe data on later `reload()` (e.g. persistence tests). The `openApp` fixture and page-object helpers handle isolation for you.

## webServer

`playwright.config.ts` runs `npm run build && npm run start` and waits for `http://127.0.0.1:3000`. Locally, an already-running app is reused (`reuseExistingServer: !process.env.CI`).

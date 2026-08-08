# Architecture overview

This project is a compact Next.js app with a single client-side task model and a visual tower renderer.

## Main responsibilities

- The app shell in [components/GoalApp.tsx](../components/GoalApp.tsx) composes the form, task list, and tower.
- [components/TaskForm.tsx](../components/TaskForm.tsx) captures new goals and submits them to the shared task state.
- [components/TaskList.tsx](../components/TaskList.tsx) displays tasks, marks them done or open, and lets the user delete them.
- [components/Tower.tsx](../components/Tower.tsx) and [components/Floor.tsx](../components/Floor.tsx) render the visual skyscraper and its floor-by-floor state.
- [lib/useTasks.ts](../lib/useTasks.ts) and [lib/storage.ts](../lib/storage.ts) manage the task state, synchronize updates, and persist them in localStorage.

## State and persistence flow

1. The app reads from the shared task hook.
2. Mutations such as add, toggle, and delete flow through the hook into the persisted task list.
3. The hook updates the in-memory cache and emits a change so the UI re-renders.
4. The persisted shape is stored under the `burj-goal:v1` key in localStorage.

## Testing shape

- [tests/e2e/goals.spec.ts](../tests/e2e/goals.spec.ts) covers the primary user flows.
- [tests/e2e/multitab.spec.ts](../tests/e2e/multitab.spec.ts) checks cross-tab synchronization and storage consistency.
- [tests/pages/goal-page.ts](../tests/pages/goal-page.ts) contains the main page-object helpers.
- [tests/fixtures/test.ts](../tests/fixtures/test.ts) exposes the shared Playwright fixture and app boot helpers.

## Notes for contributors

- Prefer accessibility selectors in tests where possible.
- Keep the UI behavior aligned with the documented state flow in [lib/useTasks.ts](../lib/useTasks.ts).
- When changing rendering or persistence behavior, update the relevant documentation and the matching Playwright coverage.

import { test as base } from "@playwright/test";
import { GoalPage, type SeedTask } from "../pages/goal-page";

type GoalFixtures = {
  goalPage: GoalPage;
  /** Navigate home with optional pre-seeded tasks (empty = cleared storage). */
  openApp: (tasks?: SeedTask[]) => Promise<GoalPage>;
};

export const test = base.extend<GoalFixtures>({
  goalPage: async ({ page }, provideFixture) => {
    const goalPage = new GoalPage(page);
    await provideFixture(goalPage);
  },

  openApp: async ({ goalPage }, provideFixture) => {
    await provideFixture(async (tasks) => {
      if (tasks && tasks.length > 0) {
        await goalPage.gotoWithTasks(tasks);
      } else {
        await goalPage.goto();
      }
      return goalPage;
    });
  },
});

export { expect } from "@playwright/test";
export type { SeedTask } from "../pages/goal-page";

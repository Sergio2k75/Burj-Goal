import { expect, test } from "@playwright/test";
import { GoalPage, STORAGE_KEY } from "../pages/goal-page";

test.describe("cross-tab persistence", () => {
  test("adds in separate tabs do not clobber each other", async ({
    context,
  }) => {
    const pageA = await context.newPage();
    const pageB = await context.newPage();
    const appA = new GoalPage(pageA);
    const appB = new GoalPage(pageB);

    await appA.goto();
    await appB.goto();

    await appA.addGoal("From tab A");
    await expect(appA.goalsList.getByText("From tab A")).toBeVisible();

    // Tab B should pick up Tab A's write via the storage event before editing.
    await expect(appB.goalsList.getByText("From tab A")).toBeVisible();

    await appB.addGoal("From tab B");
    await expect(appB.goalsList.getByText("From tab B")).toBeVisible();
    await expect(appB.goalsList.getByText("From tab A")).toBeVisible();

    await pageA.reload();

    const stored = await pageA.evaluate((key) => {
      return window.localStorage.getItem(key);
    }, STORAGE_KEY);

    const titles = stored
      ? (JSON.parse(stored) as { title: string }[]).map((t) => t.title)
      : [];

    expect(titles.sort()).toEqual(["From tab A", "From tab B"].sort());
    await expect(appA.goalsList.getByText("From tab A")).toBeVisible();
    await expect(appA.goalsList.getByText("From tab B")).toBeVisible();
  });
});

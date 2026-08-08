import { expect, test } from "@playwright/test";
import { existsSync } from "node:fs";
import path from "node:path";
import { GoalPage, type SeedTask } from "../pages/goal-page";

const SCREENSHOT_PATH = path.join("docs", "burj-goal.png");

const DEMO_TASKS: SeedTask[] = [
  {
    id: "demo-1",
    title: "Ship the MVP",
    status: "done",
    createdAt: 1,
    order: 0,
  },
  {
    id: "demo-2",
    title: "Light every floor",
    status: "done",
    createdAt: 2,
    order: 1,
  },
  {
    id: "demo-3",
    title: "Reach the spire",
    status: "open",
    createdAt: 3,
    order: 2,
  },
  {
    id: "demo-4",
    title: "Share the tower",
    status: "open",
    createdAt: 4,
    order: 3,
  },
];

test("capture README screenshot", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  const app = new GoalPage(page);
  await app.gotoWithTasks(DEMO_TASKS);

  await expect(app.brand).toBeVisible();
  await app.expectCaption("2 of 4 floors lit");
  await expect(app.goalsList.getByText("Share the tower")).toBeVisible();

  await page.screenshot({
    path: SCREENSHOT_PATH,
    fullPage: true,
  });

  expect(existsSync(SCREENSHOT_PATH)).toBe(true);
});

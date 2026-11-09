import { expect, test } from "../fixtures/test";

test.describe("Burj-Goal", () => {
  test("shows empty state with disabled add when input is blank", async ({
    openApp,
  }) => {
    const app = await openApp();

    await expect(app.brand).toBeVisible();
    await app.expectEmptyState();
    await expect(app.addButton).toBeDisabled();

    await app.goalInput.fill("   ");
    await expect(app.addButton).toBeDisabled();
  });

  test("adds a goal, trims title, and clears the input", async ({ openApp }) => {
    const app = await openApp();

    await app.addGoal("  Reach summit  ");

    await expect(app.goalsList.getByText("Reach summit")).toBeVisible();
    await expect(app.goalInput).toHaveValue("");
    await expect(app.floor(1)).toBeVisible();
    await app.expectCaption("0 of 1 floors lit");
    await expect(app.emptyCopy).toHaveCount(0);
  });

  test("expands and collapses clipped goal titles", async ({ openApp }) => {
    const app = await openApp();
    const longTitle =
      "Complete a detailed multi-step plan to improve my health, skills, relationships, and daily routines throughout the year";
    await app.addGoal("Short goal");
    await app.addGoal(longTitle);

    const title = app.goalTitle(longTitle);
    const expandButton = app.expandGoalButton(longTitle);
    await expect(expandButton).toBeVisible();
    await expect(app.expandGoalButton("Short goal")).toHaveCount(0);
    await expect
      .poll(() => title.evaluate((element) => element.scrollWidth > element.clientWidth))
      .toBe(true);

    await expandButton.click();

    const collapseButton = app.collapseGoalButton(longTitle);
    await expect(collapseButton).toBeVisible();
    await expect(collapseButton).toHaveAttribute("aria-expanded", "true");
    await expect
      .poll(() => title.evaluate((element) => element.scrollWidth <= element.clientWidth))
      .toBe(true);
    await expect(app.completeButton(longTitle)).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    await collapseButton.click();
    await expect(app.expandGoalButton(longTitle)).toBeVisible();
    await expect
      .poll(() => title.evaluate((element) => element.scrollWidth > element.clientWidth))
      .toBe(true);
  });

  test("completes and reopens a goal", async ({ openApp }) => {
    const app = await openApp();
    await app.addGoal("Light the windows");

    await app.completeGoal("Light the windows");

    await expect(app.reopenButton("Light the windows")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await app.expectCaption("1 of 1 floors lit");
    await expect(app.floor(1)).toBeVisible();

    await app.reopenGoal("Light the windows");

    await expect(app.completeButton("Light the windows")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await app.expectCaption("0 of 1 floors lit");
  });

  test("deletes a goal and returns to empty when last goal is removed", async ({
    openApp,
  }) => {
    const app = await openApp();
    await app.addGoal("First floor");
    await app.addGoal("Second floor");

    await app.expectCaption("0 of 2 floors lit");
    await expect(app.goalsList.getByText("First floor")).toBeVisible();
    await expect(app.goalsList.getByText("Second floor")).toBeVisible();

    await app.deleteGoal("Second floor");

    await expect(app.goalsList.getByText("Second floor")).toHaveCount(0);
    await expect(app.goalsList.getByText("First floor")).toBeVisible();
    await app.expectCaption("0 of 1 floors lit");

    await app.deleteGoal("First floor");

    await app.expectEmptyState();
  });

  test("persists goals across reload and clears when storage is wiped", async ({
    openApp,
  }) => {
    const app = await openApp();
    await app.addGoal("Persist me");
    await app.completeGoal("Persist me");

    await app.page.reload();

    await expect(app.reopenButton("Persist me")).toBeVisible();
    await expect(app.reopenButton("Persist me")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await app.expectCaption("1 of 1 floors lit");

    await app.clearStorageAndReload();

    await app.expectEmptyState();
  });
});

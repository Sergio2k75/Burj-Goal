import { expect, test } from "../fixtures/test";
import { STORAGE_KEY } from "../pages/goal-page";

test.describe("localStorage write failures", () => {
  test("failed persist does not drop an already-saved goal on the next add", async ({
    openApp,
  }) => {
    const app = await openApp();
    await app.addGoal("Keep me");
    await expect(app.goalsList.getByText("Keep me")).toBeVisible();

    await app.page.evaluate((key) => {
      const original = window.localStorage.setItem.bind(window.localStorage);
      window.localStorage.setItem = (k: string, v: string) => {
        if (k === key) {
          throw new DOMException("QuotaExceededError", "QuotaExceededError");
        }
        return original(k, v);
      };
    }, STORAGE_KEY);

    await app.goalInput.fill("Will not persist");
    await app.addButton.click();

    // Input kept so the user can retry; prior saved goal must remain.
    await expect(app.goalInput).toHaveValue("Will not persist");
    await expect(app.goalsList.getByText("Will not persist")).toHaveCount(0);
    await expect(app.goalsList.getByText("Keep me")).toBeVisible();
    await app.expectCaption("0 of 1 floors lit");
  });
});

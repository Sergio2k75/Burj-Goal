import { expect, type Locator, type Page } from "@playwright/test";

export const STORAGE_KEY = "burj-goal:v1";

export type SeedTask = {
  id: string;
  title: string;
  status: "open" | "done";
  createdAt: number;
  order: number;
};

export class GoalPage {
  readonly page: Page;
  readonly brand: Locator;
  readonly goalInput: Locator;
  readonly addButton: Locator;
  readonly goalsList: Locator;
  readonly tower: Locator;
  readonly emptyCopy: Locator;
  readonly caption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.brand = page.getByRole("heading", { name: "Burj-Goal", level: 1 });
    this.goalInput = page.getByLabel("New goal");
    this.addButton = page.getByRole("button", { name: "Add floor" });
    this.goalsList = page.getByRole("list", { name: "Goals" });
    this.tower = page.locator('[aria-label="Goal tower"]');
    this.emptyCopy = page.getByText(
      "Each goal becomes a floor. Light the windows by completing them.",
    );
    this.caption = this.tower.locator("p");
  }

  /** Clear storage, then navigate so the app boots from an empty tower. */
  async goto() {
    await this.page.goto("/");
    await this.page.evaluate((key) => {
      window.localStorage.removeItem(key);
    }, STORAGE_KEY);
    await this.page.reload();
  }

  /** Seed tasks into localStorage, then reload so useTasks reads them. */
  async gotoWithTasks(tasks: SeedTask[]) {
    await this.page.goto("/");
    await this.page.evaluate(
      ({ key, value }) => {
        window.localStorage.setItem(key, value);
      },
      { key: STORAGE_KEY, value: JSON.stringify(tasks) },
    );
    await this.page.reload();
  }

  async addGoal(title: string) {
    await this.goalInput.fill(title);
    await this.addButton.click();
  }

  completeButton(title: string) {
    return this.page.getByRole("button", {
      name: `Complete "${title}"`,
    });
  }

  reopenButton(title: string) {
    return this.page.getByRole("button", {
      name: `Mark "${title}" open`,
    });
  }

  deleteButton(title: string) {
    return this.page.getByRole("button", {
      name: `Delete "${title}"`,
    });
  }

  floor(floorNumber: number) {
    return this.page.locator(`[data-floor="${floorNumber}"]`);
  }

  async completeGoal(title: string) {
    await this.completeButton(title).click();
  }

  async reopenGoal(title: string) {
    await this.reopenButton(title).click();
  }

  async deleteGoal(title: string) {
    await this.deleteButton(title).click();
  }

  async expectCaption(text: string) {
    await expect(this.caption).toHaveText(text);
  }

  async expectEmptyState() {
    await expect(this.emptyCopy).toBeVisible();
    await expect(this.goalsList).toHaveCount(0);
    await this.expectCaption("Foundation ready — add your first goal");
  }

  async clearStorageAndReload() {
    await this.page.evaluate((key) => {
      window.localStorage.removeItem(key);
    }, STORAGE_KEY);
    await this.page.reload();
  }
}


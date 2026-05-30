import { test, expect } from "@playwright/test";

test.describe("Prolog Integration Engine", () => {
  test("should load the website and successfully execute a Tau-Prolog query", async ({
    page,
  }) => {
    await page.goto("./");

    await expect(page.locator("h1")).toHaveText("Declarative Class Scheduler");

    const queryButton = page.locator('button:has-text("Load & Run Solver")');
    await expect(queryButton).toBeVisible();
    await queryButton.click();

    const resultBox = page.locator(".result-box");
    await expect(resultBox).toBeVisible({ timeout: 5000 });
    await expect(resultBox).toContainText(
      "Success! Mr. Jansen can teach the class.",
    );
  });
});

import { test, expect } from "@playwright/test";

test.describe("Prolog Integration Engine", () => {
  test("should load the website and successfully execute a Tau-Prolog query", async ({
    page,
  }) => {
    // 1. Navigate to the local home page
    await page.goto("./");

    // 2. Assert the page title or header loads to verify SPA container works
    await expect(page.locator("h1")).toHaveText("Declarative Class Scheduler");

    // 3. Find and click your Hello World "Execute Query" button
    const queryButton = page.locator('button:has-text("Execute Query")');
    await expect(queryButton).toBeVisible();
    await queryButton.click();

    // 4. Wait for the reactive UI state to change and assert the Prolog binding result
    const resultBox = page.locator(".result-box");
    await expect(resultBox).toBeVisible({ timeout: 5000 });
    await expect(resultBox).toContainText("X = world");
    await expect(resultBox).toContainText(
      "Tau-Prolog integration is working perfectly!",
    );
  });
});

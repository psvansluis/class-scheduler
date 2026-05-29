import { test, expect } from "@playwright/test";

test.describe("Routing and Navigation", () => {
  test("should maintain routing state via hash history links", async ({
    page,
  }) => {
    await page.goto("./");

    // Click the navigation link to change views
    await page.click('nav a:has-text("View Schedule")');

    // Verify the URL structure reflects your pattern 2 Hash history setup
    await expect(page).toHaveURL(/.*\/#\/result/);
  });
});

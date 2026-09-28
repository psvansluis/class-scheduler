import { expect, test } from "@playwright/test";

test.describe("Theme selection", () => {
  test("defaults to corporate when dark mode is not preferred", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "no-preference" });
    await page.goto("./");

    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      "corporate",
    );
  });

  test("defaults to gothic when dark mode is preferred", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("./");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "gothic");
  });

  test("adds the selected theme to the URL", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("./");

    await page.getByText("Choose a theme..").click();
    await page.getByRole("option", { name: "Gothic" }).click();

    await expect(page).toHaveURL(/theme=gothic/);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "gothic");
  });

  test("loads the gothic theme from the URL", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("./#/result?theme=gothic");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "gothic");
  });
});

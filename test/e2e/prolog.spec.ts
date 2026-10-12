import { test, expect } from "@playwright/test";

test.describe("Prolog Integration Engine", () => {
  test("should load the website, fill out a form and successfully execute a SWI-Prolog query", async ({
    page,
  }) => {
    await page.goto("./");

    // Explicitly assert page identity
    await expect(page.locator("h1")).toHaveText("Declarative Class Scheduler");

    // --- 1. Add Skill ---
    const skillForm = page.locator("#skill-form");
    await skillForm.locator("#skill-name-input input").fill("chemistry");
    await skillForm.locator("button").click();

    // Assert skill collection rendering
    await expect(skillForm.locator(".skill-pill")).toContainText("chemistry");

    // --- 2. Add Teacher ---
    const teacherForm = page.locator("#teacher-form");
    await teacherForm.locator("#teacher-name-input input").fill("Mr. Jansen");
    await teacherForm.locator("#teacher-name-input input").press("Enter");

    // Verify card insertion inside scope and add skill inside card
    const teacherCard = teacherForm.locator(".teacher-card");
    await expect(teacherCard).toContainText("Mr. Jansen");
    await teacherCard.getByRole("combobox").click();
    await page.getByRole("option", { name: "chemistry" }).click();

    for await (const text of ["Mr. Jansen", "chemistry"]) {
      await expect(teacherCard).toContainText(text);
    }

    // --- 3. Add Course ---
    const courseForm = page.locator("#course-form");
    await courseForm
      .locator("#course-name-input input")
      .fill("Organic Chemistry 101");
    await courseForm.locator("#course-name-input button").click();

    // Verify card insertion inside scope and add skill inside card
    const courseCard = courseForm.locator(".course-card");
    await expect(courseCard).toContainText("Organic Chemistry 101");
    await courseCard.getByRole("combobox").click();
    await page.getByRole("option", { name: "chemistry" }).click();

    for await (const text of ["Organic Chemistry 101", "chemistry"]) {
      await expect(courseCard).toContainText(text);
    }

    // --- 4. Submit and Process Prolog Solution ---
    await page.getByRole("button", { name: "View Schedule" }).click();

    // Verify route hydration and UI resolution
    await expect(
      page.getByRole("heading", { name: "Generated Schedule Grid" }),
    ).toBeVisible();

    const result = page.locator("p.can-teach-result");
    for await (const text of ["Organic Chemistry 101", "Mr. Jansen"]) {
      await expect(result).toContainText(text, { timeout: 7000 });
    }
  });
});

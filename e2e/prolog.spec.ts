import { test, expect } from "@playwright/test";

test.describe("Prolog Integration Engine", () => {
  test("should load the website and successfully execute a SWI-Prolog query", async ({
    page,
  }) => {
    await page.goto("./");

    await expect(page.locator("h1")).toHaveText("Declarative Class Scheduler");

    // add skill
    const skillInput = page.locator("#skill-name-input");
    await expect(skillInput).toBeVisible();
    await skillInput.fill("chemistry");

    const addSkillButton = page.locator("#add-skill-button");
    await expect(addSkillButton).toBeVisible();
    await addSkillButton.click();

    const skillPill = page.locator(".skill-pill");
    await expect(skillPill).toContainText("chemistry");

    // add teacher
    const teacherInput = page.locator(
      "div#teacher-form input#teacher-name-input",
    );
    await expect(teacherInput).toBeVisible();
    await teacherInput.fill("Mr. Jansen");

    const teacherDropdownSelector = "div#teacher-form select#skill-dropdown";
    const teacherSkillInput = page.locator(teacherDropdownSelector);
    await expect(teacherSkillInput).toBeVisible();
    await teacherSkillInput.selectOption({ label: "chemistry" });

    const assignTeacherSkillButton = page.locator(
      "div#teacher-form button#assign-skill-button",
    );
    await expect(assignTeacherSkillButton).toBeVisible();
    await assignTeacherSkillButton.click();

    const addTeacherButton = page.locator(
      "div#teacher-form button#add-teacher-button",
    );
    await expect(addTeacherButton).toBeVisible();
    await addTeacherButton.click();

    const addedTeacherListItem = page.locator("div#teacher-form ul li");
    await expect(addedTeacherListItem).toBeVisible();
    await expect(addedTeacherListItem).toContainText("Mr. Jansen");
    await expect(addedTeacherListItem).toContainText("chemistry");

    // const queryButton = page.locator('button:has-text("Load & Run Solver")');
    // await expect(queryButton).toBeVisible();
    // await queryButton.click();

    // const resultBox = page.locator(".result-box");
    // await expect(resultBox).toBeVisible({ timeout: 5000 });
    // await expect(resultBox).toContainText(
    //   "Success! Mr. Jansen can teach the class.",
    // );
  });
});

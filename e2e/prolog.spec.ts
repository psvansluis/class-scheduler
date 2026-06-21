import { test, expect } from "@playwright/test";

test.describe("Prolog Integration Engine", () => {
  test("should load the website, fill out a form and successfully execute a SWI-Prolog query", async ({
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

    // add course
    const courseInput = page.locator("div#course-form input#course-name-input");
    await expect(courseInput).toBeVisible();
    await courseInput.fill("Organic Chemistry 101");

    const courseSkillInput = page.locator(
      "div#course-form select#skill-dropdown",
    );
    await expect(courseSkillInput).toBeVisible();
    await courseSkillInput.selectOption({ label: "chemistry" });

    const assignCourseSkillButton = page.locator(
      "div#course-form button#assign-skill-button",
    );
    await expect(assignCourseSkillButton).toBeVisible();
    await assignCourseSkillButton.click();

    const addCourseButton = page.locator(
      "div#course-form button#add-course-button",
    );
    await expect(addCourseButton).toBeVisible();
    await addCourseButton.click();

    const addedCourseListItem = page.locator("div#course-form ul li");
    await expect(addedCourseListItem).toBeVisible();
    await expect(addedCourseListItem).toContainText("Organic Chemistry 101");
    await expect(addedCourseListItem).toContainText("chemistry");

    const submitButton = page.locator('button:has-text("View Schedule")');
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    const scheduleHeader = page.locator(
      'h2:has-text("Generated Schedule Grid")',
    );
    await expect(scheduleHeader).toBeVisible();

    const canTeachResult = page.locator("p.can-teach-result");
    await expect(canTeachResult).toBeVisible({ timeout: 5000 });
    await expect(canTeachResult).toContainText("Organic Chemistry 101");
    await expect(canTeachResult).toContainText("Mr. Jansen");
  });
});

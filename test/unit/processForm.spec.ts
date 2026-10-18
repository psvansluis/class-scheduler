import { describe, it, expect } from "vitest";
import { mapFormToFacts } from "../../src/functions/processForm";
import type { Form } from "../../src/types/form";
import type { PrologSlug } from "../../src/types/slugLabel";

describe("mapFormToFacts", () => {
  it("generates valid CLP(FD) facts matching Ticket 007 schema", () => {
    const form: Form = {
      skills: new Set(["math" as PrologSlug<"skill">]),
      teachers: new Map([
        [
          "mr_jansen" as PrologSlug<"teacher">,
          {
            skills: new Set(["math" as PrologSlug<"skill">]),
            availableSlots: new Set(["mon-1", "tue-3"]),
          },
        ],
      ]),
      courses: new Map([
        [
          "algebra" as PrologSlug<"course">,
          {
            skills: new Set(["math" as PrologSlug<"skill">]),
            classCount: 2,
            constraints: [{ type: "double-block" }],
          },
        ],
      ]),
    };

    const facts = mapFormToFacts(form);

    expect(facts).toContain("teacher_skill('mr_jansen', 'math').");
    expect(facts).toContain("teacher_available('mr_jansen', slot(1, 1)).");
    expect(facts).toContain("teacher_available('mr_jansen', slot(2, 3)).");
    expect(facts).toContain("course_requires('algebra', 'math').");
    expect(facts).toContain("course_classes('algebra', 2).");
    expect(facts).toContain("course_constraint('algebra', successive(1, 2)).");
  });

  it("generates spread-days constraint facts properly", () => {
    const form: Form = {
      skills: new Set(["math" as PrologSlug<"skill">]),
      teachers: new Map(),
      courses: new Map([
        [
          "algebra" as PrologSlug<"course">,
          {
            skills: new Set(["math" as PrologSlug<"skill">]),
            classCount: 3,
            constraints: [{ type: "spread-days" }],
          },
        ],
      ]),
    };

    const facts = mapFormToFacts(form);
    expect(facts).toContain("course_classes('algebra', 3).");
    expect(facts).toContain(
      "course_constraint('algebra', min_day_gap(1, 2, 0)).",
    );
    expect(facts).toContain(
      "course_constraint('algebra', min_day_gap(2, 3, 0)).",
    );
  });

  it("supports raw successive and min_day_gap constraints", () => {
    const form: Form = {
      skills: new Set(["math" as PrologSlug<"skill">]),
      teachers: new Map(),
      courses: new Map([
        [
          "algebra" as PrologSlug<"course">,
          {
            skills: new Set(["math" as PrologSlug<"skill">]),
            classCount: 2,
            constraints: [
              { type: "min_day_gap", classA: 1, classB: 2, gap: 1 },
            ],
          },
        ],
      ]),
    };

    const facts = mapFormToFacts(form);
    expect(facts).toContain(
      "course_constraint('algebra', min_day_gap(1, 2, 1)).",
    );
  });
});

import { describe, it, expect } from "vitest";
import { mapFormToFacts } from "../../src/functions/processForm";
import { parseSchedule } from "../../src/functions/parseSchedule";
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

describe("parseSchedule", () => {
  it("parses swipl-wasm style term objects", () => {
    const raw = [
      {
        $t: "t",
        class: [
          [
            "course__Y2hlbWlzdHJ5IDEwMQ",
            1,
            "teacher__bXIgamFuc2Vu",
            {
              $t: "t",
              slot: [[1, 5]],
            },
          ],
        ],
      },
    ];

    const result = parseSchedule(raw);
    expect(result).toEqual([
      {
        course: "course__Y2hlbWlzdHJ5IDEwMQ",
        classIndex: 1,
        teacher: "teacher__bXIgamFuc2Vu",
        day: 1,
        period: 5,
      },
    ]);
  });

  it("parses swipl-wasm runtime PrologCompound objects containing functor property", () => {
    const raw = [
      {
        $t: "t",
        functor: "class",
        class: [
          [
            "course__Y2hlbWlzdHJ5IDEwMQ",
            2,
            "teacher__bXIgamFuc2Vu",
            {
              $t: "t",
              functor: "slot",
              slot: [[2, 6]],
            },
          ],
        ],
      },
    ];

    const result = parseSchedule(raw);
    expect(result).toEqual([
      {
        course: "course__Y2hlbWlzdHJ5IDEwMQ",
        classIndex: 2,
        teacher: "teacher__bXIgamFuc2Vu",
        day: 2,
        period: 6,
      },
    ]);
  });

  it("returns empty array for non-array inputs", () => {
    expect(parseSchedule(null)).toEqual([]);
    expect(parseSchedule(undefined)).toEqual([]);
    expect(parseSchedule("foo")).toEqual([]);
  });
});

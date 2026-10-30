import { describe, it, expect } from "vitest";
import { mapFormToRows } from "../../src/functions/formRows";
import { mapScheduleRows } from "../../src/functions/scheduleRows";
import type { Form } from "../../src/types/form";
import type { PrologSlug } from "../../src/types/slugLabel";

describe("mapFormToRows", () => {
  it("maps skills, availability, courses, and constraints to tagged rows", () => {
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
            constraints: [{ type: "successive", blockLength: 2 }],
          },
        ],
      ]),
    };

    expect(mapFormToRows(form)).toEqual([
      ["teacher_skill", "mr_jansen", "math"],
      ["teacher_available", "mr_jansen", 1, 1],
      ["teacher_available", "mr_jansen", 2, 3],
      ["course_requires", "algebra", "math"],
      ["course_classes", "algebra", 2],
      ["course_constraint", "algebra", "successive", 1, 2],
    ]);
  });

  it("expands a block length and a gap between blocks into independent rows", () => {
    const form: Form = {
      skills: new Set(["math" as PrologSlug<"skill">]),
      teachers: new Map(),
      courses: new Map([
        [
          "algebra" as PrologSlug<"course">,
          {
            skills: new Set(["math" as PrologSlug<"skill">]),
            classCount: 6,
            constraints: [
              { type: "successive", blockLength: 3 },
              { type: "min_day_gap", gap: 1 },
            ],
          },
        ],
      ]),
    };

    expect(mapFormToRows(form)).toEqual([
      ["course_requires", "algebra", "math"],
      ["course_classes", "algebra", 6],
      ["course_constraint", "algebra", "successive", 1, 2],
      ["course_constraint", "algebra", "successive", 2, 3],
      ["course_constraint", "algebra", "successive", 4, 5],
      ["course_constraint", "algebra", "successive", 5, 6],
      ["course_constraint", "algebra", "min_day_gap", 3, 4, 1],
    ]);
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
            constraints: [{ type: "min_day_gap", gap: 1 }],
          },
        ],
      ]),
    };

    expect(mapFormToRows(form)).toContainEqual([
      "course_constraint",
      "algebra",
      "min_day_gap",
      1,
      2,
      1,
    ]);
  });
});

describe("mapScheduleRows", () => {
  it("maps flattened Prolog rows into scheduled classes", () => {
    expect(
      mapScheduleRows([
        [
          "course__Y2hlbWlzdHJ5IDEwMQ" as PrologSlug<"course">,
          1,
          "teacher__bXIgamFuc2Vu" as PrologSlug<"teacher">,
          1,
          5,
        ],
      ]),
    ).toEqual([
      {
        course: "course__Y2hlbWlzdHJ5IDEwMQ",
        classIndex: 1,
        teacher: "teacher__bXIgamFuc2Vu",
        day: 1,
        period: 5,
      },
    ]);
  });
});

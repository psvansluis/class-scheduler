import type { CourseConstraint, Form } from "../types/form";
import type { PrologSlug } from "../types/slugLabel";
import { parseSlotId } from "./timeslots";

export type FormRow =
  | ["teacher_skill", PrologSlug<"teacher">, PrologSlug<"skill">]
  | ["teacher_available", PrologSlug<"teacher">, number, number]
  | ["course_requires", PrologSlug<"course">, PrologSlug<"skill">]
  | ["course_classes", PrologSlug<"course">, number]
  | ["course_constraint", PrologSlug<"course">, "successive", number, number]
  | [
      "course_constraint",
      PrologSlug<"course">,
      "min_day_gap",
      number,
      number,
      number,
    ];

const mapConstraintToRows = (
  course: PrologSlug<"course">,
  classCount: number,
  constraint: CourseConstraint,
): FormRow[] => {
  switch (constraint.type) {
    case "double-block":
      return classCount >= 2
        ? [["course_constraint", course, "successive", 1, 2]]
        : [];
    case "spread-days":
      return Array.from({ length: Math.max(0, classCount - 1) }, (_, index) => [
        "course_constraint",
        course,
        "min_day_gap",
        index + 1,
        index + 2,
        constraint.minGap ?? 0,
      ]);
    case "successive":
      return [
        [
          "course_constraint",
          course,
          "successive",
          constraint.classA,
          constraint.classB,
        ],
      ];
    case "min_day_gap":
      return [
        [
          "course_constraint",
          course,
          "min_day_gap",
          constraint.classA,
          constraint.classB,
          constraint.gap,
        ],
      ];
  }
};

export const mapFormToRows = (form: Form): FormRow[] => [
  ...Array.from(form.teachers).flatMap(([teacher, { skills }]) =>
    Array.from(skills).map((skill): FormRow => [
      "teacher_skill",
      teacher,
      skill,
    ]),
  ),
  ...Array.from(form.teachers).flatMap(([teacher, { availableSlots }]) =>
    Array.from(availableSlots).map((slotId): FormRow => {
      const { dayNumber, period } = parseSlotId(slotId);
      return ["teacher_available", teacher, dayNumber, period];
    }),
  ),
  ...Array.from(form.courses).flatMap(([course, { skills }]) =>
    Array.from(skills).map((skill): FormRow => [
      "course_requires",
      course,
      skill,
    ]),
  ),
  ...Array.from(form.courses).flatMap(([course, { classCount }]) => [
    ["course_classes", course, classCount ?? 1] as FormRow,
  ]),
  ...Array.from(form.courses).flatMap(([course, { classCount, constraints }]) =>
    constraints.flatMap((constraint) =>
      mapConstraintToRows(course, classCount, constraint),
    ),
  ),
];

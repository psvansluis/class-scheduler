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
  blockLength: number,
): FormRow[] => {
  switch (constraint.type) {
    case "successive":
      return Array.from(
        { length: Math.floor(classCount / constraint.blockLength) },
        (_, block) =>
          Array.from(
            { length: constraint.blockLength - 1 },
            (_, offset): FormRow => [
              "course_constraint",
              course,
              "successive",
              block * constraint.blockLength + offset + 1,
              block * constraint.blockLength + offset + 2,
            ],
          ),
      ).flat();
    case "min_day_gap":
      return Array.from(
        { length: Math.floor(classCount / blockLength) - 1 },
        (_, block): FormRow => [
          "course_constraint",
          course,
          "min_day_gap",
          (block + 1) * blockLength,
          (block + 1) * blockLength + 1,
          constraint.gap,
        ],
      );
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
      mapConstraintToRows(
        course,
        classCount,
        constraint,
        constraints.find((item) => item.type === "successive")?.blockLength ??
          1,
      ),
    ),
  ),
];

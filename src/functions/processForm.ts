import type { CourseConstraint, Form } from "../types/form.d.ts";
import type { ScheduleRow, ScheduledClass } from "../types/schedule.d.ts";
import type { PrologSlug } from "../types/slugLabel";

import { executeOpenQuery, executeClosedQuery } from "./executeQuery";
import swipl from "swipl-wasm";
import { parseSlotId } from "./timeslots";
import { mapScheduleRows } from "./scheduleRows";

const base = import.meta.env?.BASE_URL ?? "/";

export const processForm = async (form: Form): Promise<ScheduledClass[]> => {
  const rules = await getRules();
  const facts = mapFormToFacts(form);

  const rulesAndFacts = rules + "\n\n" + facts;

  const swi = await swipl();
  swi.FS.writeFile("/rules.pl", rulesAndFacts);
  await executeClosedQuery(swi, "consult('/rules.pl').");

  // solve_schedule_rows/1 unifies Schedule with the first timetable as rows.
  // An empty return list models the unsatisfiable case.
  const gen = executeOpenQuery<{ Schedule: ScheduleRow[] }>(swi)(
    "solve_schedule_rows(Schedule).",
  );
  const result = await gen.next();

  if (result.done || !result.value) {
    return [];
  }

  return mapScheduleRows(result.value.Schedule);
};

const getRules = async (): Promise<string> => {
  const response = await fetch(base + "prolog/rules.pl");
  if (!response.ok)
    throw new Error(`Could not locate core rules file: ${response.statusText}`);
  return await response.text();
};

const mapConstraintToFacts = (
  slug: PrologSlug<"course">,
  classCount: number,
  c: CourseConstraint,
): string[] => {
  switch (c.type) {
    case "double-block":
      return classCount >= 2
        ? [`course_constraint('${slug}', successive(1, 2)).`]
        : [];
    case "spread-days":
      return Array.from(
        { length: Math.max(0, classCount - 1) },
        (_, index) =>
          `course_constraint('${slug}', min_day_gap(${index + 1}, ${index + 2}, ${c.minGap ?? 0})).`,
      );
    case "successive":
      return [
        `course_constraint('${slug}', successive(${c.classA}, ${c.classB})).`,
      ];
    case "min_day_gap":
      return [
        `course_constraint('${slug}', min_day_gap(${c.classA}, ${c.classB}, ${c.gap})).`,
      ];
    default:
      return [];
  }
};

export const mapFormToFacts = (form: Form): string => {
  const teacherSkillFacts = Array.from(form.teachers).flatMap(
    ([slug, { skills }]) =>
      Array.from(skills).map(
        (skill) => `teacher_skill('${slug}', '${skill}').`,
      ),
  );

  const teacherAvailabilityFacts = Array.from(form.teachers).flatMap(
    ([slug, { availableSlots }]) =>
      Array.from(availableSlots).map((slotId) => {
        const { dayNumber, period } = parseSlotId(slotId);
        return `teacher_available('${slug}', slot(${dayNumber}, ${period})).`;
      }),
  );

  const courseRequiresFacts = Array.from(form.courses).flatMap(
    ([slug, { skills }]) =>
      Array.from(skills).map(
        (skill) => `course_requires('${slug}', '${skill}').`,
      ),
  );

  const courseClassFacts = Array.from(form.courses).map(
    ([slug, { classCount }]) =>
      `course_classes('${slug}', ${classCount ?? 1}).`,
  );

  const courseConstraintFacts = Array.from(form.courses).flatMap(
    ([slug, { classCount, constraints }]) =>
      (constraints ?? []).flatMap((c) =>
        mapConstraintToFacts(slug, classCount, c),
      ),
  );

  return [
    ...teacherSkillFacts,
    ...teacherAvailabilityFacts,
    ...courseRequiresFacts,
    ...courseClassFacts,
    ...courseConstraintFacts,
  ].join("\n");
};

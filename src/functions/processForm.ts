import type { CourseProperties } from "../types/form.d.ts";
import type { TeacherProperties } from "../types/form.d.ts";
import type { PrologSlug } from "../types/slugLabel";

import { executeOpenQuery, executeClosedQuery } from "./executeQuery";
import swipl from "swipl-wasm";
import { slugToLabel } from "./slugify.ts";

export type Form = {
  skills: Set<PrologSlug<"skill">>;
  teachers: Map<PrologSlug<"teacher">, TeacherProperties>;
  courses: Map<PrologSlug<"course">, CourseProperties>;
};

export const processForm = async (form: Form): Promise<void> => {
  const rules = await getRules();
  const facts = mapFormToFacts(form);

  const rulesAndFacts = rules + "\n\n" + facts;
  console.log(rulesAndFacts);

  const swi = await swipl();
  swi.FS.writeFile("/rules.pl", rulesAndFacts);
  await executeClosedQuery(swi, "consult('/rules.pl').");

  for await (const { Teacher, Course } of executeOpenQuery<{
    Teacher: PrologSlug<"teacher">;
    Course: PrologSlug<"course">;
  }>(swi)("can_teach(Teacher, Course).")) {
    console.log(Teacher);
    console.log(Course);
    console.log(
      `Teacher ${slugToLabel(Teacher).label} can teach ${slugToLabel(Course).label}`,
    );
  }
};

const getRules = async (): Promise<string> => {
  const response = await fetch("/prolog/rules.pl");
  if (!response.ok)
    throw new Error(`Could not locate core rules file: ${response.statusText}`);
  return await response.text();
};

const mapFormToFacts = (form: Form): string => {
  // const skillFacts = Array.from(form.skills).map((skill) => `skill(${skill}).`);
  const teacherFacts = Array.from(form.teachers).flatMap(([slug, props]) =>
    Array.from(props.skills).map(
      (prop) => `teacher_skill('${slug}', '${prop}').`,
    ),
  );
  const courseFacts = Array.from(form.courses).flatMap(([slug, props]) =>
    Array.from(props.skills).map(
      (prop) => `course_requires('${slug}', '${prop}').`,
    ),
  );
  return [...teacherFacts, ...courseFacts].join("\n");
};

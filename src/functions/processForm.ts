import type { Form } from "../types/form.d.ts";
import type { PrologSlug } from "../types/slugLabel";

import { executeOpenQuery, executeClosedQuery } from "./executeQuery";
import swipl from "swipl-wasm";
import { slugToLabel } from "./slugify.ts";

export const processForm = async (
  form: Form,
  factReceiver: string[],
): Promise<void> => {
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
    factReceiver.push(
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
      (skill) => `teacher_skill('${slug}', '${skill}').`,
    ),
  );
  const courseFacts = Array.from(form.courses).flatMap(([slug, props]) =>
    Array.from(props.skills).map(
      (skill) => `course_requires('${slug}', '${skill}').`,
    ),
  );
  return [...teacherFacts, ...courseFacts].join("\n");
};

import { Base64 } from "js-base64";

import type { CourseProperties, Form, TeacherProperties } from "../types/form";
import type { Serializable } from "../types/serializable";
import type { PrologSlug } from "../types/slugLabel";

export const encodeForm = (form: Form): string => {
  const plainObject: Serializable<Form> = {
    skills: Array.from(form.skills),
    teachers: Array.from(form.teachers.entries()).map(([slug, props]) => [
      slug,
      {
        skills: Array.from(props.skills),
        availableSlots: Array.from(props.availableSlots),
      },
    ]),
    courses: Array.from(form.courses.entries()).map(([slug, props]) => [
      slug,
      {
        skills: Array.from(props.skills),
        classCount: props.classCount,
        constraints: props.constraints,
      },
    ]),
  };

  const jsonStr = JSON.stringify(plainObject);
  return Base64.encode(jsonStr, true);
};

export const decodeForm = (hash: string): Form => {
  const decoded = Base64.decode(hash);
  const parsed: Serializable<Form> = JSON.parse(decoded);
  return {
    skills: new Set(parsed.skills ?? []),
    teachers: new Map(
      (parsed.teachers ?? []).map(
        ([slug, props]: [
          PrologSlug<"teacher">,
          Serializable<TeacherProperties>,
        ]) => [
          slug,
          {
            skills: new Set(props.skills ?? []),
            availableSlots: new Set(props.availableSlots ?? []),
          },
        ],
      ),
    ),
    courses: new Map(
      (parsed.courses ?? []).map(
        ([slug, props]: [
          PrologSlug<"course">,
          Serializable<CourseProperties>,
        ]) => [
          slug,
          {
            skills: new Set(props.skills ?? []),
            classCount:
              typeof props.classCount === "number" && props.classCount > 0
                ? props.classCount
                : 1,
            constraints: Array.isArray(props.constraints)
              ? props.constraints
              : [],
          },
        ],
      ),
    ),
  };
};

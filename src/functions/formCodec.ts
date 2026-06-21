import { Base64 } from "js-base64";

import type { Form } from "../types/form";
import type { Serializable } from "../types/serializable";
import type { PrologSlug } from "../types/slugLabel";

export const encodeForm = (form: Form): string => {
  const plainObject: Serializable<Form> = {
    skills: Array.from(form.skills),
    teachers: Array.from(form.teachers.entries()).map(([slug, props]) => [
      slug,
      { skills: Array.from(props.skills) },
    ]),
    courses: Array.from(form.courses.entries()).map(([slug, props]) => [
      slug,
      { skills: Array.from(props.skills) },
    ]),
  };

  const jsonStr = JSON.stringify(plainObject);
  return Base64.encode(jsonStr, true);
};

export const decodeForm = (hash: string): Form => {
  const decoded = Base64.decode(hash);
  const parsed: Serializable<Form> = JSON.parse(decoded);
  return {
    skills: new Set(parsed.skills as PrologSlug<"skill">[]),
    teachers: new Map(
      parsed.teachers.map(([slug, props]: [any, any]) => [
        slug,
        { skills: new Set(props.skills) },
      ]),
    ),
    courses: new Map(
      parsed.courses.map(([slug, props]: [any, any]) => [
        slug,
        { skills: new Set(props.skills) },
      ]),
    ),
  };
};

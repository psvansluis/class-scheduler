import type { PrologSlug } from "../types/slugLabel";
export interface CourseProperties {
  skills: Set<PrologSlug<"skill">>;
}

export interface TeacherProperties {
  skills: Set<PrologSlug<"skill">>;
}

export type Form = {
  skills: Set<PrologSlug<"skill">>;
  teachers: Map<PrologSlug<"teacher">, TeacherProperties>;
  courses: Map<PrologSlug<"course">, CourseProperties>;
};

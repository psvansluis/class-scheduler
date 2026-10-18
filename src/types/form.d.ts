import type { PrologSlug } from "../types/slugLabel";

export type CourseConstraint =
  | { type: "successive"; classA: number; classB: number }
  | { type: "min_day_gap"; classA: number; classB: number; gap: number }
  | { type: "double-block" }
  | { type: "spread-days"; minGap?: number };

export interface CourseProperties {
  skills: Set<PrologSlug<"skill">>;
  classCount: number;
  constraints: CourseConstraint[];
}

export interface TeacherProperties {
  skills: Set<PrologSlug<"skill">>;
  availableSlots: Set<TimeslotId>;
}

export type Form = {
  skills: Set<PrologSlug<"skill">>;
  teachers: Map<PrologSlug<"teacher">, TeacherProperties>;
  courses: Map<PrologSlug<"course">, CourseProperties>;
};

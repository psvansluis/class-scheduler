import type { PrologSlug } from "./slugLabel";
import type { TimeslotId } from "../functions/timeslots";

export type CourseConstraint =
  | { type: "successive"; blockLength: number }
  | { type: "min_day_gap"; gap: number };

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

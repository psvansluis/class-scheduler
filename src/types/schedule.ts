import type { PrologSlug } from "./slugLabel";
import { PERIODS } from "../functions/timeslots";

export interface ScheduledClass {
  course: PrologSlug<"course">;
  classIndex: number;
  teacher: PrologSlug<"teacher">;
  day: 1 | 2 | 3 | 4 | 5; // 1–5 (Mon–Fri)
  period: (typeof PERIODS)[number]; // 1–8
}

export type ScheduleRow = [
  PrologSlug<"course">,
  number,
  PrologSlug<"teacher">,
  ScheduledClass["day"],
  ScheduledClass["period"],
];

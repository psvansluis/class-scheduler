import type { ScheduleRow, ScheduledClass } from "../types/schedule";

export const mapScheduleRows = (rows: ScheduleRow[]): ScheduledClass[] =>
  rows.map(([course, classIndex, teacher, day, period]) => ({
    course,
    classIndex,
    teacher,
    day,
    period,
  }));

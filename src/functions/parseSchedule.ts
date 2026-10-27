import type { ScheduledClass } from "../types/schedule";
import type { PrologSlug } from "../types/slugLabel";
import type { PERIODS } from "./timeslots";

const unpackTerm = (
  term: unknown,
): { functor: string; args: unknown[] } | null => {
  if (typeof term !== "object" || term === null) return null;
  const obj = term as Record<string, unknown>;
  if (Array.isArray(obj.args)) {
    return { functor: String(obj.functor ?? ""), args: obj.args };
  }
  const functor =
    typeof obj.functor === "string" && obj.functor in obj
      ? obj.functor
      : Object.keys(obj).find((k) => k !== "$t" && k !== "functor");
  if (!functor) return null;
  const val = obj[functor];
  return Array.isArray(val) && Array.isArray(val[0])
    ? { functor, args: val[0] }
    : null;
};
const parseSingleClass = (term: unknown): ScheduledClass => {
  const classTerm = unpackTerm(term);
  if (!classTerm || classTerm.args.length < 4) {
    throw new Error(`Invalid class term structure: ${JSON.stringify(term)}`);
  }
  const slotTerm = unpackTerm(classTerm.args[3]);
  if (!slotTerm || slotTerm.args.length < 2) {
    throw new Error(
      `Invalid slot term structure: ${JSON.stringify(classTerm.args[3])}`,
    );
  }
  return {
    course: classTerm.args[0] as PrologSlug<"course">,
    classIndex: classTerm.args[1] as number,
    teacher: classTerm.args[2] as PrologSlug<"teacher">,
    day: Number(slotTerm.args[0]) as 1 | 2 | 3 | 4 | 5,
    period: Number(slotTerm.args[1]) as (typeof PERIODS)[number],
  };
};

export const parseSchedule = (raw: unknown): ScheduledClass[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseSingleClass);
};

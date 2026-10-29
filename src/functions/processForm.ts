import type { Form } from "../types/form.d.ts";
import type { ScheduleRow, ScheduledClass } from "../types/schedule.d.ts";

import {
  executeOpenQuery,
  executeClosedQuery,
  executeBoundQuery,
} from "./executeQuery";
import swipl from "swipl-wasm";
import { mapScheduleRows } from "./scheduleRows";
import { mapFormToRows } from "./formRows";

const base = import.meta.env?.BASE_URL ?? "/";
const PROLOG_FILES = [
  { path: ["prolog"], file: "rules.pl" },
  { path: ["prolog", "domain"], file: "scheduler_domain.pl" },
  { path: ["prolog", "adapters"], file: "schedule_io.pl" },
] as const;
const PROLOG_ENTRYPOINT = PROLOG_FILES[0];

export const processForm = async (form: Form): Promise<ScheduledClass[]> => {
  const swi = await swipl();
  await loadPrologFiles(swi);
  await executeClosedQuery(
    swi,
    `consult('/${[...PROLOG_ENTRYPOINT.path, PROLOG_ENTRYPOINT.file].join("/")}').`,
  );
  const loaded = await executeBoundQuery(swi, "rules:load_form(Facts).", {
    Facts: mapFormToRows(form),
  });
  if (!loaded) throw new Error("Could not load form data into Prolog.");

  // solve_schedule_rows/1 unifies Schedule with the first timetable as rows.
  // An empty return list models the unsatisfiable case.
  const gen = executeOpenQuery<{ Schedule: ScheduleRow[] }>(swi)(
    "rules:solve_schedule_rows(Schedule).",
  );
  const result = await gen.next();

  if (result.done || !result.value) {
    return [];
  }

  return mapScheduleRows(result.value.Schedule);
};

const loadPrologFiles = async (swi: swipl.SWIPLModule): Promise<void> => {
  const sources = await Promise.all(
    PROLOG_FILES.map(async ({ path, file }) => {
      const relativePath = [...path, file].join("/");
      const response = await fetch(base + relativePath);
      if (!response.ok)
        throw new Error(
          `Could not locate Prolog file ${relativePath}: ${response.statusText}`,
        );
      return { path, file, source: await response.text() };
    }),
  );

  const ensureDirectories = (path: readonly string[]): void => {
    if (path.length === 0) return;
    ensureDirectories(path.slice(0, -1));
    const directory = `/${path.join("/")}`;
    if (!swi.FS.analyzePath(directory).exists) swi.FS.mkdir(directory);
  };

  sources.forEach(({ path, file, source }) => {
    ensureDirectories(path);
    swi.FS.writeFile(`/${[...path, file].join("/")}`, source);
  });
};

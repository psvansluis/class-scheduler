import swipl from "swipl-wasm";

import type {
  ClosedQuery,
  HasVariables,
  QueryBindings,
} from "./queryVariables";

export async function executeClosedQuery<Q extends string = string>(
  engine: swipl.SWIPLModule,
  queryString: Q & ClosedQuery<Q>,
): Promise<boolean> {
  const query = engine.prolog.query(queryString);
  const result = (await query.once()) as { success: boolean } | null;
  return result?.success === true;
}

export async function* executeOpenQuery<Q extends string>(
  engine: swipl.SWIPLModule,
  queryString: Q &
    (HasVariables<Q> extends true
      ? Q
      : "❌ Type Error: Open queries must contain at least one uppercase variable."),
): AsyncGenerator<{ bindings: QueryBindings<Q> }, void, unknown> {
  const query = engine.prolog.query(queryString);
  while (true) {
    const answer = (await query.next()) as {
      value: QueryBindings<Q>;
      done: boolean;
    } | null;
    if (!answer || !("value" in answer)) return;
    yield { bindings: answer.value as QueryBindings<Q> };
    if (answer.done === true) return;
  }
}

import swipl from "swipl-wasm";

import type {
  ClosedQuery,
  HasVariables,
  QueryBindings,
  QueryVariables,
  SameSet,
} from "./queryVariables";

export async function executeClosedQuery<Q extends string = string>(
  engine: swipl.SWIPLModule,
  queryString: Q & ClosedQuery<Q>,
): Promise<boolean> {
  const query = engine.prolog.query(queryString);
  const result = (await query.once()) as { success: boolean } | null;
  return result?.success === true;
}

type TypedOrUntypedOpenQuery<T, Q extends string> =
  Record<string, unknown> extends T
    ? HasVariables<Q>
    : SameSet<QueryVariables<Q>, Extract<keyof T, string>>;

type GetOpenQueryErrorMessage<T, Q extends string> =
  Record<string, unknown> extends T
    ? "Open queries must contain at least one uppercase variable."
    : `Variable mismatch. Query contains [${Extract<QueryVariables<Q>, string>}], but interface expects [${Extract<keyof T, string>}]`;

export type ValidateOpenQueryString<T, Q extends string> =
  TypedOrUntypedOpenQuery<T, Q> extends true
    ? Q
    : GetOpenQueryErrorMessage<T, Q>;

export function executeOpenQuery<
  T extends Record<string, any> = Record<string, unknown>,
>(engine: any) {
  return async function* <Q extends string>(
    queryString: ValidateOpenQueryString<T, Q>,
  ): AsyncGenerator<
    { bindings: Record<string, unknown> extends T ? QueryBindings<Q> : T },
    void,
    unknown
  > {
    const query = await engine.prolog.query(queryString);
    try {
      while (true) {
        const answer = await query.next();
        if (!answer || !("value" in answer)) return;

        yield {
          bindings: answer.value as Record<string, unknown> extends T
            ? QueryBindings<Q>
            : T,
        };

        if (answer.done === true) return;
      }
    } finally {
      if (query) await query.close();
    }
  };
}

// ---------------------------------------------------------------------
// Character classes
// ---------------------------------------------------------------------

type Lower =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";

type Upper = Uppercase<Lower>;

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type IdentifierStart = Lower | Upper | "_";
type IdentifierCont = IdentifierStart | Digit;

// ---------------------------------------------------------------------
// Read an identifier
// ---------------------------------------------------------------------

type TakeIdentifier<
  S extends string,
  Acc extends string,
> = S extends `${infer C}${infer Rest}`
  ? C extends IdentifierCont
    ? TakeIdentifier<Rest, `${Acc}${C}`>
    : [Acc, `${C}${Rest}`]
  : [Acc, ""];

// ---------------------------------------------------------------------
// Extract all identifiers from a string
// ---------------------------------------------------------------------

type Identifiers<
  S extends string,
  Acc extends string = never,
> = S extends `${infer C}${infer Rest}`
  ? C extends IdentifierStart
    ? TakeIdentifier<Rest, C> extends [
        infer Id extends string,
        infer Remaining extends string,
      ]
      ? Identifiers<Remaining, Acc | Id>
      : never
    : Identifiers<Rest, Acc>
  : Acc;

// ---------------------------------------------------------------------
// Prolog variable test
// ---------------------------------------------------------------------

type IsPrologVariable<S extends string> = S extends `_${string}`
  ? true
  : S extends Capitalize<S>
    ? S extends Uncapitalize<S>
      ? false
      : true
    : false;

// ---------------------------------------------------------------------
// Ignore variables beginning with _
// ---------------------------------------------------------------------

type VisibleVariable<S extends string> = S extends `_${string}` ? never : S;

// ---------------------------------------------------------------------
// Extract visible variables from a query
// ---------------------------------------------------------------------

type QueryVariables<Q extends string> = {
  [K in Identifiers<Q>]: IsPrologVariable<K> extends true
    ? VisibleVariable<K>
    : never;
}[Identifiers<Q>];

// ---------------------------------------------------------------------
// Utility: set equality
// ---------------------------------------------------------------------

type SameSet<A extends string, B extends string> = [Exclude<A, B>] extends [
  never,
]
  ? [Exclude<B, A>] extends [never]
    ? true
    : false
  : false;

// ---------------------------------------------------------------------
// Closed query
// ---------------------------------------------------------------------

export type ClosedQuery<Q extends string> = [QueryVariables<Q>] extends [never]
  ? Q
  : never;

// ---------------------------------------------------------------------
// Open query
// ---------------------------------------------------------------------
export type OpenQuery<Vars extends Record<string, unknown>, Q extends string> =
  SameSet<QueryVariables<Q>, Extract<keyof Vars, string>> extends true
    ? Q
    : never;

// ---------------------------------------------------------------------
// Derived helper types
// ---------------------------------------------------------------------

export type HasVariables<Q extends string> = [QueryVariables<Q>] extends [never]
  ? false
  : true;

type QueryBindings<Q extends string> = {
  [K in QueryVariables<Q>]: unknown;
};

type QueryResult<Q extends string> = QueryBindings<Q>[];

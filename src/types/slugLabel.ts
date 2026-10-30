export type HumanLabel = string & { readonly __brand: unique symbol };
declare const brand: unique symbol;

export type PrologSlug<T extends TypePrefix> = string & {
  readonly [brand]: T;
};
export type TypePrefix = "teacher" | "course" | "skill";

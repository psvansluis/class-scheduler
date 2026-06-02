export type Success<T> = { tag: "success"; value: T };
export type Failure<E> = { tag: "failure"; error: E };
export type Result<T, E = string> = Success<T> | Failure<E>;

export const success = <T>(value: T): Success<T> => ({ tag: "success", value });
export const failure = <E>(error: E): Failure<E> => ({ tag: "failure", error });

export interface TestSpecification {
  description: string;
  expected: boolean;
  factsListObj: any;
  pureQueryObj: any;
}

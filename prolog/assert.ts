import pl from "tau-prolog";
import { flattenFactsList } from "./ast.js";
import { success, failure } from "./types.js";
import type { Result, TestSpecification } from "./types.js";

/**
 * Evaluates a single target query string against a prepared session context.
 */
function executeAssertion(
  session: any,
  queryString: string,
  expected: boolean,
): Promise<Result<boolean>> {
  return new Promise((resolve) => {
    session.query(queryString, {
      success: () => {
        session.answer({
          success: () => resolve(success(expected === true)),
          fail: () => resolve(success(expected === false)),
          error: (err: any) =>
            resolve(failure(`Runtime execution failed: ${err.toString()}`)),
        });
      },
      error: (err: any) =>
        resolve(failure(`Query parsing syntax error: ${err.toString()}`)),
    });
  });
}

/**
 * Spins up an isolated Tau-Prolog runtime session, loads the provided domain code,
 * mounts the target spec facts database, and evaluates the assertion.
 */
export function runIsolatedAssert(
  coreRulesText: string,
  spec: TestSpecification,
): Promise<Result<boolean>> {
  return new Promise((resolve) => {
    const cleanSession = pl.create();

    // 1. Load the primary scheduling constraints code
    cleanSession.consult(coreRulesText, {
      success: () => {
        const factsBuffer = flattenFactsList(spec.factsListObj).join("\n");

        // 2. Load the specific mock data ecosystem rules
        cleanSession.consult(factsBuffer, {
          success: () => {
            const targetQueryString = `${spec.pureQueryObj.toString()}.`;

            // 3. Delegate to the final assertion evaluator
            resolve(
              executeAssertion(cleanSession, targetQueryString, spec.expected),
            );
          },
          error: (err: any) =>
            resolve(
              failure(`Failed to consult mock facts layout: ${err.toString()}`),
            ),
        });
      },
      error: (err: any) =>
        resolve(
          failure(`Failed to consult core rules database: ${err.toString()}`),
        ),
    });
  });
}

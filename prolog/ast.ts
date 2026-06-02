import { TestSpecification } from "./types.js";

/**
 * Purely decodes a Tau-Prolog character list term back into a native JS string.
 */
export function decodePrologString(charListTerm: any): string {
  let result = "";
  let current = charListTerm;
  while (current && current.id === "." && current.args?.length === 2) {
    result += current.args[0].id;
    current = current.args[1];
  }
  return result;
}

/**
 * Flattens an unquoted list of terms into an array of individual Prolog syntax lines.
 */
export function flattenFactsList(factsListTerm: any): string[] {
  const factsArray: string[] = [];
  let current = factsListTerm;
  while (current && current.id === "." && current.args?.length === 2) {
    factsArray.push(`${current.args[0].toString()}.`);
    current = current.args[1];
  }
  return factsArray;
}

/**
 * Extracts a test case specification safely out of an unified query answer.
 */
export function extractSpecification(answer: any): TestSpecification {
  const rawDesc = answer.lookup("Desc");
  const expected = answer.lookup("Expected").id === "true";
  const factsListObj = answer.lookup("Facts");

  // Peel off the leading '-' prefix wrapper operator
  const queryWrapperObj = answer.lookup("Query");
  const pureQueryObj = queryWrapperObj.args[0];

  return {
    description: decodePrologString(rawDesc),
    expected,
    factsListObj,
    pureQueryObj,
  };
}

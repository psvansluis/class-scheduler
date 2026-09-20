import { describe, it, expect } from "vitest";
import swipl from "swipl-wasm";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve the directory of this test file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Helper to read files from the original "prolog" directory (two levels up)
const readFile = (fileName: string): string =>
  fs.readFileSync(path.resolve(__dirname, "../../prolog", fileName), "utf8");

/** Execute a Prolog query and return the result object. */
async function executeQuery(
  engine: any,
  queryString: string,
): Promise<{ success: boolean }> {
  const query = await engine.prolog.query(queryString);
  const result = await query.once();
  await query.close();
  return result;
}

/** Run the Prolog test suite and return true if all PlUnit tests pass. */
export async function runPrologTests(): Promise<boolean> {
  const coreRulesText = readFile("rules.pl");
  const testManifestText = readFile("tests.pl");
  const testSuite = `${coreRulesText}\n\n${testManifestText}`;

  const swi = await swipl();
  swi.FS.writeFile("/test_suite.pl", testSuite);
  await executeQuery(swi, "consult('/test_suite.pl').");

  const testExecution = await executeQuery(swi, "run_tests.");
  return testExecution.success;
}

// Vitest integration
describe("Prolog test suite (Vitest)", () => {
  it("should pass all PlUnit assertions", async () => {
    const success = await runPrologTests();
    expect(success).toBe(true);
  });
});

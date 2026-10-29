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
  engine: swipl.SWIPLModule,
  queryString: string,
): Promise<{ success: boolean }> {
  const query = await engine.prolog.query(queryString);
  const result = (await query.once()) as { success: boolean };
  return result;
}

/** Run the Prolog test suite and return true if all PlUnit tests pass. */
export async function runPrologTests(): Promise<boolean> {
  const swi = await swipl();
  swi.FS.mkdir("/prolog");
  swi.FS.mkdir("/prolog/domain");
  swi.FS.mkdir("/prolog/adapters");
  swi.FS.mkdir("/prolog/tests");
  for (const file of [
    "rules.pl",
    "domain/scheduler_domain.pl",
    "adapters/schedule_io.pl",
    "tests/domain_tests.pl",
    "tests/boundary_tests.pl",
  ]) {
    swi.FS.writeFile(`/prolog/${file}`, readFile(file));
  }

  await executeQuery(swi, "consult('/prolog/tests/domain_tests.pl').");
  await executeQuery(swi, "consult('/prolog/tests/boundary_tests.pl').");

  const domainTests = await executeQuery(swi, "run_tests(domain_tests).");
  const boundaryTests = await executeQuery(swi, "run_tests(boundary_tests).");
  return domainTests.success && boundaryTests.success;
}

// Vitest integration
describe("Prolog test suite (Vitest)", () => {
  it("should pass all PlUnit assertions", async () => {
    const success = await runPrologTests();
    expect(success).toBe(true);
  });
});

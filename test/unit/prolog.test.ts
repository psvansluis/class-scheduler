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

// Vitest integration
describe("Prolog test suite (Vitest)", () => {
  it.each(["domain_tests", "boundary_tests"] as const)(
    "should pass %s tests",
    async (moduleName) => {
      const swi = await swipl();
      const testFile = `tests/${moduleName}.pl`;

      swi.FS.mkdir("/prolog");
      swi.FS.mkdir("/prolog/domain");
      swi.FS.mkdir("/prolog/adapters");
      swi.FS.mkdir("/prolog/tests");
      for (const file of [
        "rules.pl",
        "domain/scheduler_domain.pl",
        "adapters/schedule_io.pl",
        testFile,
      ]) {
        swi.FS.writeFile(`/prolog/${file}`, readFile(file));
      }

      await executeQuery(swi, `consult('/prolog/${testFile}').`);
      const result = await executeQuery(swi, `run_tests(${moduleName}).`);
      expect(result.success).toBe(true);
    },
  );
});

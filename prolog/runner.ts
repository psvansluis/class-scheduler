import swipl from "swipl-wasm";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const underscore = (s: string): string => `\x1b[4m${s}\x1b[0m`;

const log = (s: string): void => console.log("\n" + underscore(s));

async function executeQuery(
  engine: any,
  queryString: string,
): Promise<{ success: boolean }> {
  const query = await engine.prolog.query(queryString);
  const result = await query.once();
  await query.close();
  return result;
}

const readFile = (fileName: string): string =>
  fs.readFileSync(path.resolve(__dirname, fileName), "utf8");

async function main(): Promise<void> {
  log("📂 Loading Prolog Rules and Test Manifest...");
  const coreRulesText = readFile("rules.pl");
  const testManifestText = readFile("tests.pl");
  const testSuite = `${coreRulesText}\n\n${testManifestText}`;

  log("🚀 Initializing SWI-Prolog WebAssembly Engine...");
  const swi = await swipl();
  swi.FS.writeFile("/test_suite.pl", testSuite);
  await executeQuery(swi, "consult('/test_suite.pl').");

  log("Executing PlUnit Specification Suite...");
  const testExecution = await executeQuery(swi, "run_tests.");

  const [msg, exitCode] = testExecution.success
    ? ["✅ Success! All PlUnit assertions passed.", 0]
    : ["❌ Failure! Some PlUnit assertions failed or errored.", 1];
  log("Test Execution Summary:\n" + msg);
  process.exit(exitCode);
}

main().catch((err) => {
  console.error("💥 Critical Engine Panic:", err);
  process.exit(1);
});

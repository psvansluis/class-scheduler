import swipl from "swipl-wasm";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  console.log("🏁 Initializing SWI-Prolog WebAssembly Engine...");
  const SWI = await swipl();

  const coreRulesText = readFile("rules.pl");
  const testManifestText = readFile("tests.pl");

  const unifiedTestSuite = `${coreRulesText}\n\n${testManifestText}`;
  SWI.FS.writeFile("/test_suite.pl", unifiedTestSuite);
  await executeQuery(SWI, "consult('/test_suite.pl').");

  console.log("Executing PlUnit Specification Suite...\n");

  const testExecution = await executeQuery(SWI, "run_tests.");

  console.log(`==============================================`);
  const [msg, exitCode] = testExecution.success
    ? ["🎉 Success! All native PlUnit specifications passed cleanly.", 0]
    : ["💥 Suite failure: Some PlUnit assertions failed or errored.", 1];

  console.log(msg);
  process.exit(exitCode);
}

main().catch((err) => {
  console.error("💥 Critical Engine Panic:", err);
  process.exit(1);
});

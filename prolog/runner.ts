import swipl from "swipl-wasm";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Executes a Prolog query and safely ensures the engine stream finishes
 * compiling/evaluating before releasing the JS thread promise wrapper.
 */
async function executeQuery(
  engine: any,
  queryString: string,
): Promise<{ success: boolean }> {
  const query = await engine.prolog.query(queryString);
  const result = await query.once();
  await query.close(); // Cleanly dispose the engine's current query thread handle
  return result;
}

async function main(): Promise<void> {
  console.log("🏁 Initializing SWI-Prolog WebAssembly Engine...");
  const SWI = await swipl();

  const coreRulesText = fs.readFileSync(
    path.resolve(__dirname, "rules.pl"),
    "utf8",
  );
  const testManifestText = fs.readFileSync(
    path.resolve(__dirname, "tests.pl"),
    "utf8",
  );

  console.log("📂 Mounting code into WASM Virtual Filesystem...");
  SWI.FS.writeFile("/rules.pl", coreRulesText);
  SWI.FS.writeFile("/tests.pl", testManifestText);

  console.log("🔨 Compiling Prolog source contexts...");

  // Explicitly await the closing of the compilation stream for rules.pl
  await executeQuery(SWI, "consult('/rules.pl').");

  // Explicitly await the closing of the compilation stream for tests.pl
  await executeQuery(SWI, "consult('/tests.pl').");

  console.log("🏃 Executing PlUnit Specification Suite...\n");

  // Execute the test framework cleanly inside its own isolated timeline
  const testExecution = await executeQuery(SWI, "run_tests.");

  console.log(`==============================================`);
  if (testExecution.success) {
    console.log("🎉 Success! All native PlUnit specifications passed cleanly.");
    process.exit(0);
  } else {
    console.error(
      "💥 Suite failure: Some PlUnit assertions failed or errored.",
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("💥 Critical Engine Panic:", err);
  process.exit(1);
});

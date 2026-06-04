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
  await query.close();
  return result;
}

const readAndConsultPrologFile = async (engine: any, fileName: string) => {
  const filePath = path.resolve(__dirname, fileName);
  const fileContent = fs.readFileSync(filePath, "utf8");
  engine.FS.writeFile(`/${fileName}`, fileContent);
  await executeQuery(engine, `consult('/${fileName}').`);
};

async function main(): Promise<void> {
  console.log("🏁 Initializing SWI-Prolog WebAssembly Engine...");
  const SWI = await swipl();

  for (const file of ["rules.pl", "tests.pl"]) {
    console.log(`📂 Loading Prolog file: ${file}`);
    await readAndConsultPrologFile(SWI, file);
  }

  console.log("🏃 Executing PlUnit Specification Suite...\n");

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

import pl from "tau-prolog";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runIsolatedAssert } from "./assert.js";
import { extractSpecification } from "./ast.js";
import { success, failure } from "./types.js";
import type { Result } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Streams through discovery queries and accumulates specifications iteratively.
 */
function harvestManifestSpecs(discoverySession: any): Promise<Result<any[]>> {
  return new Promise((resolve) => {
    const specs: any[] = [];

    discoverySession.query("spec(Id, Desc, Facts, Query, Expected).", {
      success: () => {
        const fetchNext = () => {
          discoverySession.answer({
            success: (answer: any) => {
              specs.push(extractSpecification(answer));
              fetchNext(); // Continue streaming pointer
            },
            fail: () => resolve(success(specs)), // Stream completed naturally
            error: (err: any) =>
              resolve(
                failure(`Manifest query loop exception: ${err.toString()}`),
              ),
          });
        };
        fetchNext();
      },
      error: (err: any) =>
        resolve(
          failure(
            `Invalid query initialization inside tests.pl: ${err.toString()}`,
          ),
        ),
    });
  });
}

/**
 * Main application runner loop orchestrator.
 */
async function main(): Promise<void> {
  const coreRulesText = fs.readFileSync(
    path.resolve(__dirname, "rules.pl"),
    "utf8",
  );
  const testManifestText = fs.readFileSync(
    path.resolve(__dirname, "tests.pl"),
    "utf8",
  );

  console.log("🔍 Initializing test manifest parsing context...");
  const discoverySession = pl.create();

  // Consult the tests specification file
  const manifestLoadResult = await new Promise<Result<any[]>>((resolve) => {
    discoverySession.consult(testManifestText, {
      success: () => resolve(harvestManifestSpecs(discoverySession)),
      error: (err: any) =>
        resolve(
          failure(`Failed to parse tests.pl syntax layout: ${err.toString()}`),
        ),
    });
  });

  if (manifestLoadResult.tag === "failure") {
    console.error(`❌ Suite Initialization Error: ${manifestLoadResult.error}`);
    process.exit(1);
  }

  const testSuite = manifestLoadResult.value;
  console.log(
    `🚀 Collected ${testSuite.length} specifications. Executing test operations...\n`,
  );

  let suitePassed = true;

  for (let i = 0; i < testSuite.length; i++) {
    const spec = testSuite[i];
    console.log(`🏃 Running Test [${i + 1}]: ${spec.description}...`);

    const runResult = await runIsolatedAssert(coreRulesText, spec);

    if (runResult.tag === "success" && runResult.value === true) {
      console.log("   ✅ PASSED\n");
    } else if (runResult.tag === "success" && runResult.value === false) {
      console.log(`   ❌ FAILED (Assertion output did not meet expectation)\n`);
      suitePassed = false;
    } else if (runResult.tag === "failure") {
      console.log(`   💥 CRASHED: ${runResult.error}\n`);
      suitePassed = false;
    }
  }

  console.log(`==============================================`);
  if (suitePassed) {
    console.log(`🎉 Success! All ${testSuite.length} specifications passed.`);
    process.exit(0);
  } else {
    console.error(
      "💥 Suite failure: Some specifications failed to compile or run.",
    );
    process.exit(1);
  }
}

main();

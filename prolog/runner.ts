import pl from "tau-prolog/modules/core.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const coreRules = fs.readFileSync(path.resolve(__dirname, "rules.pl"), "utf8");
const testManifest = fs.readFileSync(
  path.resolve(__dirname, "tests.pl"),
  "utf8",
);

function runIsolatedAssert(
  mockFactsListObj: any,
  targetQueryObj: any,
  expected: boolean,
): Promise<boolean> {
  return new Promise((resolve) => {
    const cleanSession = pl.create();

    // 1. Consult the base scheduling domain rules first
    cleanSession.consult(coreRules, {
      success: () => {
        // 2. Unroll the Prolog Facts list structure right inside JavaScript.
        // In Tau-Prolog, lists are nested objects where id === '.' and args has [Head, Tail].
        let factsArray: string[] = [];
        let current = mockFactsListObj;

        while (current && current.id === "." && current.args?.length === 2) {
          factsArray.push(`${current.args[0].toString()}.`);
          current = current.args[1]; // Walk to next linked cell
        }

        // Combine individual facts into standard lines
        const factsBuffer = factsArray.join("\n");

        // 3. Use consult to inject these specific facts into the session state
        cleanSession.consult(factsBuffer, {
          success: () => {
            // 4. Run the target assertion query signature safely
            const targetQueryString = `${targetQueryObj.toString()}.`;

            cleanSession.query(targetQueryString, {
              success: () => {
                cleanSession.answer({
                  success: () => resolve(expected === true),
                  fail: () => resolve(expected === false),
                  error: () => resolve(false),
                });
              },
              error: () => resolve(false),
            });
          },
          error: () => resolve(false),
        });
      },
      error: () => resolve(false),
    });
  });
}

async function main() {
  const discoverySession = pl.create();

  discoverySession.consult(testManifest, {
    success: () => {
      console.log(
        "🔍 Test manifest parsed. Iterating over unquoted specs...\n",
      );
      discoverySession.query("spec(Id, Desc, Facts, Query, Expected).", {
        success: () => collectAndRunTests(discoverySession),
        error: (err) => console.error(err.toString()),
      });
    },
    error: (err) => {
      console.error(
        "❌ Failed to parse tests.pl configuration:",
        err.toString(),
      );
      process.exit(1);
    },
  });
}

async function collectAndRunTests(session: any) {
  let allPassed = true;
  let testCount = 0;

  const getNextTest = () => {
    session.answer({
      success: async (answer: any) => {
        testCount++;

        // Fix for Description array: In Tau-Prolog, text tokens are stored as character ids.
        // We extract the human-readable text by targeting the underlying term mapping accurately.
        const descTerm = answer.lookup("Desc");
        let desc = "";
        let currentCar = descTerm;
        while (
          currentCar &&
          currentCar.id === "." &&
          currentCar.args?.length === 2
        ) {
          desc += currentCar.args[0].id;
          currentCar = currentCar.args[1];
        }

        const expected = answer.lookup("Expected").id === "true";
        const factsListObj = answer.lookup("Facts");

        // Peal away the '-' wrapper operator to target the core query block
        const queryWrapperObj = answer.lookup("Query");
        const pureQueryObj = queryWrapperObj.args[0];

        console.log(`🏃 Running Test [${testCount}]: ${desc}...`);

        const passed = await runIsolatedAssert(
          factsListObj,
          pureQueryObj,
          expected,
        );

        if (passed) {
          console.log("   ✅ PASSED\n");
        } else {
          console.log(`   ❌ FAILED (Expected outcome: ${expected})\n`);
          allPassed = false;
        }

        getNextTest();
      },
      fail: () => {
        console.log(`==============================================`);
        if (allPassed) {
          console.log(
            `🎉 Success! All ${testCount} unquoted domain specs passed smoothly.`,
          );
          process.exit(0);
        } else {
          console.error("💥 Suite failure: Some specifications failed.");
          process.exit(1);
        }
      },
      error: (err: any) => {
        console.error(
          "💥 Error during specification traversal:",
          err.toString(),
        );
        process.exit(1);
      },
    });
  };

  getNextTest();
}

main();

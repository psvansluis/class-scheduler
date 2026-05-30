import pl from "tau-prolog/modules/core.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const session = pl.create();

// 1. Read core rules
const rulesPath = path.resolve(__dirname, "rules.pl");
const coreRules = fs.readFileSync(rulesPath, "utf8");

// 2. Inject localized test data representing a matching skill scenario
const mockTestData = `
    teacher_skill(mr_jansen, math).
    course_requires(algebra, math).
`;

console.log("=== 1. Compiling Rules + Mock Test Data ===");

session.consult(coreRules + mockTestData, {
  success: () => {
    console.log("✅ Engine compiled seamlessly.");
    runSingleTestAssertion();
  },
  error: (err) => {
    console.error("❌ Compilation error:", err.toString());
  },
});

function runSingleTestAssertion() {
  const targetQuery = "can_teach(mr_jansen, algebra).";
  console.log(`\n=== 2. Running Assertion Query: ${targetQuery} ===`);

  session.query(targetQuery, {
    success: () => {
      // Check the answer stream pointer
      session.answer({
        success: (answer) => {
          // This block ONLY fires if Prolog successfully finds a derivation path (True)
          console.log("✅ TEST PASSED: Mr. Jansen can teach Algebra.");
          process.exit(0); // Exit code 0 signals a healthy green pipeline
        },
        fail: () => {
          // This fires if the constraints are violated or unprovable (False)
          console.error(
            "❌ TEST FAILED: The engine evaluated the query to 'false'.",
          );
          process.exit(1); // Exit code 1 flags the failure to GitHub Actions
        },
        error: (err) => {
          console.error(
            "💥 TEST CRASHED: A runtime exception occurred:",
            err.toString(),
          );
          process.exit(1);
        },
      });
    },
    error: (err) => {
      console.error("❌ Query structural parsing failed:", err.toString());
      process.exit(1);
    },
  });
}

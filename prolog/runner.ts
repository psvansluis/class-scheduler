import pl from "tau-prolog/modules/core.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. Initialize session container
const session = pl.create();

// 2. Read the source file from disk
const rulesPath = path.resolve(__dirname, "rules.pl");
const rulesSource = fs.readFileSync(rulesPath, "utf8");

console.log("=== 1. Submitting Rules to Compiler ===");

// 3. Consult the engine and WAIT for the success callback to fire safely
session.consult(rulesSource, {
  success: () => {
    console.log("✅ Compilation complete. Safe async context entered.\n");
    runSafeDiagnostics();
  },
  error: (err) => {
    console.error("❌ Syntax compilation error:", err.toString());
  },
});

function runSafeDiagnostics() {
  console.log("=== 2. Querying Engine via Public API ===");

  // We ask Prolog to find all user-defined predicates matching Name/Arity
  // This query is fully async-safe because it executes inside the compiled context.
  session.query("current_predicate(Name/Arity).", {
    success: () => {
      // Fetch the first answer from the engine stream
      getNextAnswer();
    },
    error: (err) => {
      console.error("❌ Query initiation failed:", err.toString());
    },
  });
}

function getNextAnswer() {
  session.answer({
    success: (answer) => {
      // Extract the variable bindings from the substitution object
      const name = answer.lookup("Name").id;
      const arity = answer.lookup("Arity").value;

      // Filter out internal system terms, displaying only our domain logic
      if (name !== "current_predicate" && name !== "consult") {
        console.log(`   👉 Found Predicate: ${name}/${arity}`);
      }

      // Loop to get the next bound predicate from the pointer stream
      getNextAnswer();
    },
    fail: () => {
      // The pointer stream cleanly hits 'fail' when there are no more predicates left
      console.log("\n=== 3. End of Diagnostic Run ===");
    },
    error: (err) => {
      console.error("❌ Runtime exception during streaming:", err.toString());
    },
  });
}

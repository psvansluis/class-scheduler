<template>
  <div class="prolog-test">
    <h3>Decoupled Prolog Test</h3>
    <button @click="runTest">Load & Run Solver</button>
    <p v-if="result" class="result-box">Result: {{ result }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import swipl from "swipl-wasm";
const result = ref<string | null>(null);

async function executeQuery(
  engine: any,
  queryString: string,
): Promise<{ success: boolean }> {
  const query = await engine.prolog.query(queryString);
  const result = await query.once();
  await query.close();
  return result;
}

const runTest = async () => {
  // 1. Fetch the physical .pl file from the server
  const response = await fetch("./prolog/rules.pl");
  const programText = await response.text();

  // 2. Dynamic runtime data injection (simulating form inputs)
  const dynamicFacts = `
    teacher_skill(mr_jansen, chemistry).
    course_requires(organic_chemistry_101, chemistry).
  `;

  const combinedRules = programText + "\n\n" + dynamicFacts;

  const swi = await swipl();

  swi.FS.writeFile("/rules.pl", combinedRules);

  await executeQuery(swi, "consult('/rules.pl').");

  const canTeach = await executeQuery(
    swi,
    "can_teach(mr_jansen, organic_chemistry_101).",
  );

  console.log({ canTeachResult: canTeach });

  result.value = canTeach.success
    ? "Success! Mr. Jansen can teach the class."
    : "Failed: Constraints violated.";
};
</script>

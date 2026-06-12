<template>
  <div class="prolog-test">
    <h3>Decoupled Prolog Test</h3>
    <button :disabled="isLoading" @click="runTest">
      {{ isLoading ? "Computing Layout..." : "Load & Run Solver" }}
    </button>
    <ClassroomSpinner v-if="isLoading" title="Computing Layout..." />
    <p v-if="result" class="result-box">Result: {{ result }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import swipl from "swipl-wasm";
import ClassroomSpinner from "./ClassroomSpinner.vue";
import {
  executeClosedQuery,
  executeOpenQuery,
} from "../functions/executeQuery";

const result = ref<string | null>(null);
const isLoading = ref(false);

const runTest = async () => {
  isLoading.value = true;
  result.value = null;

  await new Promise((r) => setTimeout(r, 2000));

  try {
    // 1. Absolute root fetch ensures assets resolve from the public folder regardless of the URL route
    const response = await fetch("/prolog/rules.pl");
    if (!response.ok)
      throw new Error(
        `Could not locate core rules file: ${response.statusText}`,
      );
    const programText = await response.text();

    // 2. Map form data dynamically to a fact string
    const dynamicFacts = `
      teacher_skill(mr_jansen, chemistry).
      course_requires(organic_chemistry_101, chemistry).
    `;

    const combinedRules = `${programText}\n\n${dynamicFacts}`;

    // 3. Instantiate the isolated engine thread
    const swi = await swipl();
    swi.FS.writeFile("/rules.pl", combinedRules);
    await executeClosedQuery(swi, "consult('/rules.pl')."); // Load the rules into the engine context

    // 4. Run the validation proof
    const canTeach = await executeClosedQuery(
      swi,
      "can_teach(mr_jansen, organic_chemistry_101).",
    );

    await executeOpenQuery(
      swi,
      "can_teach(Teacher, organic_chemistry_101).",
    ).next();

    for await (const y of executeOpenQuery(swi, "plus(Y, 0, 4).")) {
      console.log("Query result for plus(Y, 0, 4):", y.bindings.Y); // Should log 4
    }

    const stream = executeOpenQuery(swi, "teacher_skill(mr_jansen, Skill).");

    for await (const result of stream) {
      // Clear, elegant, and completely un-nested
      console.log("Found skill row:", result.bindings.Skill);
    }

    result.value = canTeach
      ? "Success! Mr. Jansen can teach the class."
      : "Failed: Constraints violated.";
  } catch (error) {
    console.error("💥 WASM Engine Execution Fault:", error);
    result.value = "Engine Error: Failed to resolve schedule constraints.";
  } finally {
    isLoading.value = false;
  }
};
</script>

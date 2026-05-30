<template>
  <div class="prolog-test">
    <h3>Decoupled Prolog Test</h3>
    <button @click="runTest">Load & Run Solver</button>
    <p v-if="result" class="result-box">Result: {{ result }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const pl = (window as any).pl;
const result = ref<string | null>(null);

const runTest = async () => {
  // 1. Fetch the physical .pl file from the server
  const response = await fetch("./prolog/rules.pl");
  const programText = await response.text();

  // 2. Dynamic runtime data injection (simulating form inputs)
  const dynamicFacts = `
    teacher_skill(mr_jansen, chemistry).
    course_requires(organic_chemistry_101, chemistry).
  `;

  const session = pl.create();

  // Combine the file content with user inputs
  session.consult(programText + dynamicFacts, {
    success: () => {
      session.query("can_teach(mr_jansen, organic_chemistry_101).", {
        success: () => {
          session.answer({
            success: (answer: any) => {
              // If substitution links are empty but success is triggered,
              // it implies a true/false query succeeded cleanly.
              console.log(answer);
              result.value = "Success! Mr. Jansen can teach the class.";
            },
            fail: () => {
              result.value = "Failed: Constraints violated.";
            },
          });
        },
      });
    },
  });
};
</script>

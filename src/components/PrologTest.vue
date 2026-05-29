<template>
  <div class="prolog-test">
    <h3>Prolog Integration Test</h3>

    <div class="status-box">
      <p><strong>Database:</strong> <code>say_hello(world).</code></p>
      <p><strong>Query:</strong> <code>say_hello(X).</code></p>

      <button @click="runTest">Execute Query</button>
    </div>

    <div v-if="result" class="result-box">
      <p><strong>Result:</strong> X = {{ result }}</p>
      <p class="success-msg">✅ Tau-Prolog integration is working perfectly!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// Import Tau-Prolog core. It initializes itself on the global scope.
const pl = (window as any).pl;

const result = ref<string | null>(null);

const runTest = () => {
  // 1. Create a new Prolog session
  const session = pl.create();

  // 2. Define your knowledge base (rules and facts)
  const program = `
    say_hello(world).
    say_hello(vue_and_typescript).
  `;

  // 3. Consult (load) the program into the session
  session.consult(program, {
    success: () => {
      // 4. Query the session once consulting succeeds
      session.query("say_hello(X).", {
        success: () => {
          // 5. Look for the first answer
          session.answer({
            success: (answer: any) => {
              // Extract the value bound to the variable 'X'
              // Tau-Prolog represents values as objects; .id extracts standard terms
              const binding = answer.links["X"];
              result.value = binding.id;
            },
            error: (err: any) => {
              console.error("Query answer error:", err);
            },
          });
        },
        error: (err: any) => {
          console.error("Query compilation error:", err);
        },
      });
    },
    error: (err: any) => {
      console.error("Consultation syntax error:", err);
    },
  });
};
</script>

<style scoped>
.prolog-test {
  border: 1px solid #ccc;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 500px;
  margin: 1rem auto;
}
.status-box {
  margin-bottom: 1rem;
}
button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #35495e;
}
.result-box {
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
}
.success-msg {
  color: #52c41a;
  font-weight: bold;
}
</style>

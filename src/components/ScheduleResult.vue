<template>
  <div class="max-w-3xl space-y-6">
    <h2 class="text-2xl font-semibold tracking-tight text-foreground">
      Generated Schedule Grid
    </h2>

    <ClassroomSpinner
      v-if="loading"
      :title="`Processing Prolog Query Engine...`"
    />

    <div
      v-else-if="error"
      class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm font-medium text-destructive"
    >
      {{ error }}
    </div>

    <div v-else class="space-y-4">
      <div
        class="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-xs space-y-2"
      >
        <p
          v-for="fact in facts"
          :key="fact"
          class="can-teach-result rounded-md border border-border bg-background p-3 font-mono text-sm text-foreground shadow-2xs"
        >
          {{ fact }}
        </p>
      </div>

      <div class="pt-2">
        <AppLink
          name="form"
          class="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          ← Edit current form parameters
        </AppLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { processForm } from "../functions/processForm";
import ClassroomSpinner from "./ClassroomSpinner.vue";
import { stateQueryToForm } from "../functions/stateQuery.ts";

const route = useRoute();
const loading = ref(true);
const error = ref<string | null>(null);
const facts = ref<string[]>([]);

onMounted(async () => {
  const form = stateQueryToForm(route);
  if (!form) {
    error.value =
      "❌ No decodable schedule context payload provided in the URL parameter path.";
    loading.value = false;
    return;
  }
  try {
    await processForm(form, facts.value);
  } catch (err: any) {
    console.error(err);
    error.value = `Failed to process layout calculations: ${err.message || err}`;
  } finally {
    loading.value = false;
  }
});
</script>

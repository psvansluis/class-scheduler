<template>
  <h2>Generated Schedule Grid</h2>
  <ClassroomSpinner
    v-if="loading"
    :title="`Processing Prolog Query Engine...`"
  />
  <div v-else-if="error" class="error">{{ error }}</div>
  <div v-else>
    <p class="can-teach-result" v-for="fact in facts" :key="fact">
      {{ fact }}
    </p>
    <AppLink name="form">← Edit current form parameters</AppLink>
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

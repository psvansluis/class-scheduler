<template>
  <h2>Generated Schedule Grid</h2>
  <ClassroomSpinner
    v-if="loading"
    :title="`Processing Prolog Query Engine...`"
  />
  <div v-else-if="error" class="error">{{ error }}</div>
  <div v-else>
    <p>
      Consultation successful. Check browser console logs for computed fact
      bindings!
    </p>
    <router-link :to="{ name: 'form', query: { state: $route.query.state } }">
      ← Edit current form parameters
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { decodeForm } from "../functions/formCodec";
import { processForm } from "../functions/processForm";
import ClassroomSpinner from "./ClassroomSpinner.vue";

const route = useRoute();
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  const stateQuery = route.query.state;
  if (!stateQuery || typeof stateQuery !== "string") {
    error.value =
      "❌ No schedule context payload provided in the URL parameter path.";
    loading.value = false;
    return;
  }

  try {
    // 1. Rebuild the structured collection facts directly from url hash
    const formState = decodeForm(stateQuery);

    // 2. Feed the pure state directly to our swipl-wasm runtime pipeline
    await processForm(formState);
  } catch (err: any) {
    console.error(err);
    error.value = `Failed to process layout calculations: ${err.message || err}`;
  } finally {
    loading.value = false;
  }
});
</script>

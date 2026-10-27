<template>
  <div class="max-w-5xl space-y-6">
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

    <template v-else>
      <div
        v-if="isUnsatisfiable"
        class="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-sm font-medium text-amber-700 dark:text-amber-400"
      >
        ⚠️ No conflict-free timetable could be found. Try adding more teacher
        availability or relaxing course constraints.
      </div>

      <TimetableGrid v-else :classes="schedule" />

      <div class="pt-2">
        <AppLink
          name="form"
          class="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          ← Edit current form parameters
        </AppLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { processForm } from "../functions/processForm";
import ClassroomSpinner from "./ClassroomSpinner.vue";
import TimetableGrid from "./TimetableGrid.vue";
import { stateQueryToForm } from "../functions/stateQuery.ts";
import type { ScheduledClass } from "@/types/schedule.js";

const route = useRoute();
const loading = ref(true);
const error = ref<string | null>(null);
const schedule = ref<ScheduledClass[]>([]);

const isUnsatisfiable = computed(
  () => !loading.value && !error.value && schedule.value.length === 0,
);

onMounted(async () => {
  const form = stateQueryToForm(route);
  if (!form) {
    error.value =
      "❌ No decodable schedule context payload provided in the URL parameter path.";
    loading.value = false;
    return;
  }
  try {
    schedule.value = await processForm(form);
  } catch (err: Error | unknown) {
    console.error(err);
    error.value = `Failed to process layout calculations: ${err instanceof Error ? err.message : err}`;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="skill-selector-field">
    <label for="skill-dropdown">Assign Skills</label>
    <div class="input-row">
      <select id="skill-dropdown" v-model="pendingSelection">
        <option value="" disabled>Choose a skill...</option>
        <option
          v-for="slug in availableSkills"
          :key="slug"
          :value="slug"
          :disabled="modelValue.has(slug)"
        >
          {{ slugToLabel(slug).label }}
        </option>
      </select>
      <button type="button" :disabled="!pendingSelection" @click="addSelected">
        Assign
      </button>
    </div>

    <div class="assigned-pills">
      <span v-for="slug in modelValue" :key="slug" class="assigned-pill">
        {{ slugToLabel(slug).label }}
        <button type="button" @click="removeSelected(slug)">✕</button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { slugToLabel } from "../functions/slugify";
import type { PrologSlug } from "../types/slugLabel";

const props = defineProps<{
  availableSkills: Set<PrologSlug<"skill">>;
}>();

const modelValue = defineModel<Set<PrologSlug<"skill">>>({
  default: () => new Set(),
});

const pendingSelection = ref<PrologSlug<"skill"> | null>(null);

const addSelected = () => {
  if (pendingSelection.value) {
    modelValue.value.add(pendingSelection.value as PrologSlug<"skill">);
    pendingSelection.value = null;
  }
};

const removeSelected = (slug: PrologSlug<"skill">) => {
  modelValue.value.delete(slug);
};
</script>

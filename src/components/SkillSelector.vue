<template>
  <div class="skill-selector-field">
    <label for="skill-dropdown" class="selector-label">Assign Skills</label>

    <div class="input-row">
      <div class="select-wrapper app-input-wrapper-hover">
        <select
          id="skill-dropdown"
          v-model="pendingSelection"
          class="app-input-field"
          @change="addSelected"
        >
          <option :value="null" disabled>Choose a skill to assign...</option>
          <option
            v-for="slug in availableSkills"
            :key="slug"
            :value="slug"
            :disabled="modelValue.has(slug)"
          >
            {{ slugToLabel(slug).label }}
          </option>
        </select>
        <span class="material-icons-outlined app-action-badge dropdown-badge">
          arrow_drop_down
        </span>
      </div>
    </div>

    <div class="assigned-pills">
      <SkillPill
        v-for="slug in modelValue"
        :key="slug"
        :slug="slug"
        removable
        @remove-skill="removeSelected(slug)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { slugToLabel } from "../functions/slugify";
import type { PrologSlug } from "../types/slugLabel";
import SkillPill from "./SkillPill.vue";
import "@material-design-icons/font";

defineProps<{
  availableSkills: Set<PrologSlug<"skill">>;
}>();

const modelValue = defineModel<Set<PrologSlug<"skill">>>({
  default: () => new Set(),
});

const pendingSelection = ref<PrologSlug<"skill"> | null>(null);

const addSelected = () => {
  if (pendingSelection.value) {
    modelValue.value.add(pendingSelection.value);
    pendingSelection.value = null;
  }
};

const removeSelected = (slug: PrologSlug<"skill">) => {
  modelValue.value.delete(slug);
};
</script>

<style scoped>
.skill-selector-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.selector-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
}

.input-row {
  display: flex;
  max-width: 350px;
}

.select-wrapper {
  position: relative;
  flex: 1;
}

.select-wrapper select {
  appearance: none;
  cursor: pointer;
}

.dropdown-badge {
  pointer-events: none; /* Let select element register the click context */
}

.select-wrapper select:focus + .dropdown-badge {
  border-color: #42b883;
  color: #42b883;
}

.assigned-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: 4px;
  min-height: 40px;
}
</style>

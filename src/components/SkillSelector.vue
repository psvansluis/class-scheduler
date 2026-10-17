<template>
  <div class="flex flex-col gap-2 max-w-sm">
    <Select
      v-model="pendingSelection"
      :disabled="availableSkills.size === 0"
      @update:model-value="addSelected"
    >
      <SelectTrigger class="w-full">
        <SelectValue
          :placeholder="
            availableSkills.size === 0
              ? 'No skills defined yet'
              : 'Choose a skill…'
          "
        />
      </SelectTrigger>

      <SelectContent>
        <SelectItem
          v-for="slug in availableSkills"
          :key="slug"
          :value="slug"
          :disabled="modelValue.has(slug)"
        >
          {{ slugToLabel(slug).label }}
        </SelectItem>
      </SelectContent>
    </Select>

    <div
      v-if="modelValue.size > 0"
      class="flex flex-wrap gap-1 mt-1 min-h-[2rem]"
    >
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

defineProps<{
  availableSkills: Set<PrologSlug<"skill">>;
}>();

const modelValue = defineModel<Set<PrologSlug<"skill">>>({
  default: () => new Set(),
});

const pendingSelection = ref<PrologSlug<"skill"> | null>(null);

const addSelected = () => {
  if (pendingSelection.value) {
    const next = new Set(modelValue.value);
    next.add(pendingSelection.value);
    modelValue.value = next;
    pendingSelection.value = null;
  }
};

const removeSelected = (slug: PrologSlug<"skill">) => {
  const next = new Set(modelValue.value);
  next.delete(slug);
  modelValue.value = next;
};
</script>

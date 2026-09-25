<template>
  <div class="flex flex-col gap-2 max-w-sm">
    <Select v-model="pendingSelection" @update:modelValue="addSelected">
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Choose a skill…" />
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

    <div class="flex flex-wrap gap-1 mt-1 min-h-[2rem]">
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
    modelValue.value.add(pendingSelection.value);
    pendingSelection.value = null;
  }
};

const removeSelected = (slug: PrologSlug<"skill">) => {
  modelValue.value.delete(slug);
};
</script>

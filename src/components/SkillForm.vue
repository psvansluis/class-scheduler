<template>
  <h3>Skill Form</h3>
  <input
    v-model="rawInput"
    placeholder="Enter a skill name"
    @keyup.enter="commit"
  />
  <button :disabled="!isValid" @click="commit">Add Skill</button>

  <div>
    <span v-for="slug in skills" :key="slug" class="skill-pill">
      {{ slugToLabel(slug).label }}
      <button @click="$emit('removeSkill', slug)">❌</button>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { labelToSlug, slugToLabel } from "../functions/slugify";
import type { HumanLabel, PrologSlug } from "../types/slugLabel";

defineProps<{
  skills: Set<PrologSlug>;
}>();

const emit = defineEmits<{
  (e: "addSkill", slug: PrologSlug): void;
  (e: "removeSkill", slug: PrologSlug): void;
}>();

const rawInput = ref("");
const isValid = computed(() => rawInput.value.trim().length > 0);

const commit = () => {
  if (!isValid.value) return;
  try {
    emit("addSkill", labelToSlug(rawInput.value as HumanLabel, "skill"));
    rawInput.value = "";
  } catch (err) {
    console.error(err);
  }
};
</script>

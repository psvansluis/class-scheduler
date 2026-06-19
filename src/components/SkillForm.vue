<template>
  <h3>Skill Form</h3>

  <NameInput
    v-model="rawInput"
    v-model:valid="isValid"
    placeholder="Skill name"
    @enter-pressed="commit"
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
import { ref } from "vue";
import NameInput from "./NameInput.vue";
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
const isValid = ref(false);

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

<style lang="css">
.skill-pill {
  color: var(--vt-c-text-dark-2, #42b883);
  background-color: #eee;
  border-color: #666;
  border-width: 2px;
  border-style: solid;
  border-radius: 7px;
  margin: 5px;
  padding: 5px;
}
</style>

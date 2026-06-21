<template>
  <div id="skill-form">
    <h3>Skill Form</h3>

    <NameInput
      id="skill-name-input"
      v-model="rawInput"
      v-model:valid="isValid"
      placeholder="Skill name"
      @enter-pressed="commit"
    />
    <button id="add-skill-button" :disabled="!isValid" @click="commit">
      Add Skill
    </button>

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
  skills: Set<PrologSlug<"skill">>;
}>();

const emit = defineEmits<{
  (e: "addSkill", slug: PrologSlug<"skill">): void;
  (e: "removeSkill", slug: PrologSlug<"skill">): void;
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
#skill-name-input {
  border-width: 2px;
}
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

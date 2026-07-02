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

    <div class="skill-pill-container" v-if="skills.size > 0">
      <SkillPill
        v-for="slug in skills"
        :key="slug"
        :slug="slug"
        removable
        @remove-skill="$emit('removeSkill', slug)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NameInput from "./NameInput.vue";
import SkillPill from "./SkillPill.vue";
import { labelToSlug } from "../functions/slugify";
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
.skill-pill-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: space-between;
}
</style>

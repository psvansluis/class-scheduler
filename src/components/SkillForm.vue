<script lang="ts" setup>
import { computed, ref } from "vue";

const newSkill = ref("");
const skills = ref<Set<string>>(new Set());
const canAddSkill = computed(() => newSkill.value.trim().length > 0);
const addSkill = () => {
  if (canAddSkill.value) {
    skills.value.add(newSkill.value.trim());
    newSkill.value = "";
    emit("update:skills", skills.value);
  }
};
const removeSkill = (skill: string) => {
  skills.value.delete(skill);
  emit("update:skills", skills.value);
};
const emit = defineEmits({
  "update:skills": (skills: Set<string>): boolean => {
    if (skills.size === 0) {
      console.warn("No skills provided. Emitting empty set.");
      return false;
    }
    return true;
  },
});
</script>

<template>
  <h3>Skill form</h3>
  <input v-model="newSkill" placeholder="Enter a skill name" />
  <button :disabled="!canAddSkill" @click="addSkill">Add Skill</button>
  <br />
  <p v-for="skill in skills" :key="skill" class="skill-pill">
    {{ skill }}
    <button @click="removeSkill(skill)">❌</button>
  </p>
</template>

<style>
.skill-pill {
  display: inline-block;
  padding: 4px 12px;
  margin: 4px;
  color: var(--vt-c-text-dark-2, #42b883);
  border-color: #666;
  border-width: 2px;
  border-style: solid;
  animation: flip-page 1.2s infinite ease-in-out;
  border-radius: 4px;
}
</style>

<template>
  <h2>Setup Forms</h2>
  <SkillForm @update:skills="onSkillsUpdate" />
  <TeacherForm :skills="updatedSkills" />
  <CourseForm />
</template>

<script setup lang="ts">
import SkillForm from "./SkillForm.vue";
import TeacherForm from "./TeacherForm.vue";
import CourseForm from "./CourseForm.vue";
import { ref } from "vue";

const updatedSkills = ref<Set<string>>(new Set());
const onSkillsUpdate = (skills: Set<string>) => {
  updatedSkills.value = skills;
};
</script>

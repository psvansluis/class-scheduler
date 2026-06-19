<template>
  <div>
    <h2>Setup Forms</h2>
    <SkillForm
      :skills="skills"
      @add-skill="addSkill"
      @remove-skill="removeSkill"
    />
    <TeacherForm
      :skills="skills"
      :teachers="teachers"
      @add-teacher="addTeacher"
      @remove-teacher="removeTeacher"
    />
  </div>
  <button @click="submit">Submit</button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SkillForm from "./SkillForm.vue";
import TeacherForm, { type TeacherProperties } from "./TeacherForm.vue";
import type { PrologSlug } from "../types/slugLabel";

const skills = ref<Set<PrologSlug>>(new Set());
const teachers = ref<Map<PrologSlug, TeacherProperties>>(new Map());

const addSkill = (slug: PrologSlug) => {
  skills.value.add(slug);
};

const removeSkill = (slug: PrologSlug) => {
  skills.value.delete(slug);
  teachers.value.forEach((t) => t.skills.delete(slug));
};

const addTeacher = (payload: {
  slug: PrologSlug;
  properties: TeacherProperties;
}) => {
  teachers.value.set(payload.slug, payload.properties);
};

const removeTeacher = (slug: PrologSlug) => {
  teachers.value.delete(slug);
};

const submit = () => {
  console.log("Skills:", Array.from(skills.value));
  console.log("Teachers:", teachers.value);
};
</script>

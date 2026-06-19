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
import TeacherForm from "./TeacherForm.vue";
import type { PrologSlug } from "../types/slugLabel";

interface Teacher {
  slug: PrologSlug;
  skills: Set<PrologSlug>;
}

const skills = ref<Set<PrologSlug>>(new Set());
const teachers = ref<Teacher[]>([]);

const addSkill = (slug: PrologSlug) => {
  skills.value.add(slug);
};

const removeSkill = (slug: PrologSlug) => {
  skills.value.delete(slug);
  teachers.value.forEach((t) => t.skills.delete(slug));
};

const addTeacher = (payload: { slug: PrologSlug; skills: Set<PrologSlug> }) => {
  teachers.value.push(payload);
};

const removeTeacher = (slug: PrologSlug) => {
  teachers.value = teachers.value.filter((t) => t.slug !== slug);
};

const submit = () => {
  console.log("Skills:", Array.from(skills.value));
  console.log("Teachers:", teachers.value);
};
</script>

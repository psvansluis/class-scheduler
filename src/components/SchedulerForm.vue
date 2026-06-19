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
    <CourseForm
      :skills="skills"
      :courses="courses"
      @add-course="addCourse"
      @remove-course="removeCourse"
    ></CourseForm>
  </div>
  <button @click="submit">Submit</button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SkillForm from "./SkillForm.vue";
import TeacherForm, { type TeacherProperties } from "./TeacherForm.vue";
import type { PrologSlug } from "../types/slugLabel";
import CourseForm, { type CourseProperties } from "./CourseForm.vue";

const skills = ref<Set<PrologSlug>>(new Set());
const teachers = ref<Map<PrologSlug, TeacherProperties>>(new Map());
const courses = ref<Map<PrologSlug, CourseProperties>>(new Map());

const addSkill = (slug: PrologSlug) => {
  skills.value.add(slug);
};

const removeSkill = (slug: PrologSlug) => {
  skills.value.delete(slug);
  teachers.value.forEach((t) => t.skills.delete(slug));
  courses.value.forEach((c) => c.skills.delete(slug));
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

const addCourse = (payload: {
  slug: PrologSlug;
  properties: CourseProperties;
}) => {
  courses.value.set(payload.slug, payload.properties);
};

const removeCourse = (slug: PrologSlug) => {
  courses.value.delete(slug);
};

const submit = () => {
  console.log("Skills:", Array.from(skills.value));
  console.log("Teachers:", Array.from(teachers.value));
  console.log("Courses:", Array.from(courses.value));
};
</script>

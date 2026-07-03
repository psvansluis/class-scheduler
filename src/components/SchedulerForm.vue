<template>
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
  <button @click="clear">Clear</button>
  <button @click="save">Save</button>
  <button @click="submit">View Schedule</button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import SkillForm from "./SkillForm.vue";
import TeacherForm from "./TeacherForm.vue";
import type { PrologSlug } from "../types/slugLabel";
import CourseForm from "./CourseForm.vue";
import type { CourseProperties, Form, TeacherProperties } from "../types/form";
import { useRoute, useRouter } from "vue-router";
import { formToStateQuery, stateQueryToForm } from "../functions/stateQuery.ts";

const route = useRoute();
const router = useRouter();

const skills = ref<Set<PrologSlug<"skill">>>(new Set());
const teachers = ref<Map<PrologSlug<"teacher">, TeacherProperties>>(new Map());
const courses = ref<Map<PrologSlug<"course">, CourseProperties>>(new Map());

onMounted(() => {
  const form = stateQueryToForm(route);
  if (form) {
    skills.value = form.skills;
    teachers.value = form.teachers;
    courses.value = form.courses;
  }
});

const addSkill = (slug: PrologSlug<"skill">) => skills.value.add(slug);

const removeSkill = (slug: PrologSlug<"skill">) => {
  skills.value.delete(slug);
  teachers.value.forEach((t) => t.skills.delete(slug));
  courses.value.forEach((c) => c.skills.delete(slug));
};

const addTeacher = (payload: {
  slug: PrologSlug<"teacher">;
  properties: TeacherProperties;
}) => teachers.value.set(payload.slug, payload.properties);

const removeTeacher = (slug: PrologSlug<"teacher">) =>
  teachers.value.delete(slug);

const addCourse = (payload: {
  slug: PrologSlug<"course">;
  properties: CourseProperties;
}) => courses.value.set(payload.slug, payload.properties);

const removeCourse = (slug: PrologSlug<"course">) => courses.value.delete(slug);

const form = (): Form => ({
  skills: skills.value,
  teachers: teachers.value,
  courses: courses.value,
});

const resetForm = (): void => {
  skills.value = new Set();
  teachers.value = new Map();
  courses.value = new Map();
};

const clear = () => {
  resetForm();
  save();
};

const save = () => formToStateQuery(form(), router);

const submit = () => formToStateQuery(form(), router, "result");
</script>

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
import { onMounted, ref } from "vue";
import SkillForm from "./SkillForm.vue";
import TeacherForm from "./TeacherForm.vue";
import type { PrologSlug } from "../types/slugLabel";
import CourseForm from "./CourseForm.vue";
import { processForm } from "../functions/processForm.ts";
import type { CourseProperties, TeacherProperties } from "../types/form";
import { useRoute, useRouter } from "vue-router";
import { decodeForm, encodeForm } from "../functions/formCodec.ts";

const route = useRoute();
const router = useRouter();

const skills = ref<Set<PrologSlug<"skill">>>(new Set());
const teachers = ref<Map<PrologSlug<"teacher">, TeacherProperties>>(new Map());
const courses = ref<Map<PrologSlug<"course">, CourseProperties>>(new Map());

onMounted(() => {
  const stateQuery = route.query.state;
  if (typeof stateQuery === "string" && stateQuery.length > 0) {
    try {
      const hydrated = decodeForm(stateQuery);
      skills.value = hydrated.skills;
      teachers.value = hydrated.teachers;
      courses.value = hydrated.courses;
    } catch (e) {
      console.error("Failed to parse form state from URL payload", e);
    }
  }
});

const addSkill = (slug: PrologSlug<"skill">) => {
  skills.value.add(slug);
};

const removeSkill = (slug: PrologSlug<"skill">) => {
  skills.value.delete(slug);
  teachers.value.forEach((t) => t.skills.delete(slug));
  courses.value.forEach((c) => c.skills.delete(slug));
};

const addTeacher = (payload: {
  slug: PrologSlug<"teacher">;
  properties: TeacherProperties;
}) => {
  teachers.value.set(payload.slug, payload.properties);
};

const removeTeacher = (slug: PrologSlug<"teacher">) => {
  teachers.value.delete(slug);
};

const addCourse = (payload: {
  slug: PrologSlug<"course">;
  properties: CourseProperties;
}) => {
  courses.value.set(payload.slug, payload.properties);
};

const removeCourse = (slug: PrologSlug<"course">) => {
  courses.value.delete(slug);
};

const submit = () => {
  const form = {
    skills: skills.value,
    teachers: teachers.value,
    courses: courses.value,
  };
  const encodedState = encodeForm(form);
  router.push({ name: "result", query: { state: encodedState } });
};
</script>

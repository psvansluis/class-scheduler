<template>
  <div class="space-y-8">
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
    >
      <div
        class="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-xs"
      >
        <SkillForm
          :skills="skills"
          @add-skill="addSkill"
          @remove-skill="removeSkill"
        />
      </div>

      <div
        class="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-xs"
      >
        <TeacherForm
          :skills="skills"
          :teachers="teachers"
          @add-teacher="addTeacher"
          @remove-teacher="removeTeacher"
        />
      </div>

      <div
        class="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-xs"
      >
        <CourseForm
          :skills="skills"
          :courses="courses"
          @add-course="addCourse"
          @remove-course="removeCourse"
        />
      </div>
    </div>

    <!-- Action Toolbar -->
    <div
      class="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-border"
    >
      <Button variant="outline" @click="clear"> Clear </Button>
      <Button variant="secondary" @click="save"> Save </Button>
      <Button @click="submit"> View Schedule </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import SkillForm from "./SkillForm.vue";
import TeacherForm from "./TeacherForm.vue";
import CourseForm from "./CourseForm.vue";
import { Button } from "@/components/ui/button";
import type { PrologSlug } from "../types/slugLabel";
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

<template>
  <div>
    <h3>Course Form</h3>
    <input v-model="rawName" placeholder="Enter course name" />
    <SkillSelector :available-skills="skills" v-model="draftSkills" />
    <button :disabled="!canCommit" @click="commit">Add Course</button>
    <h4 v-if="courses.size > 0">Registered Courses</h4>
    <ul>
      <li v-for="[slug, properties] in courses" :key="slug">
        <i>{{ slugToLabel(slug).label }}</i> (<span
          v-for="skill in properties.skills"
          :key="skill"
        >
          {{ slugToLabel(skill).label }}</span
        >)
        <button @click="$emit('removeCourse', slug)">❌</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import SkillSelector from "./SkillSelector.vue";
import type { HumanLabel, PrologSlug } from "../types/slugLabel";
import { labelToSlug, slugToLabel } from "../functions/slugify";

export interface CourseProperties {
  skills: Set<PrologSlug>;
}

defineProps<{
  skills: Set<PrologSlug>;
  courses: Map<PrologSlug, CourseProperties>;
}>();

const rawName = ref<string>("");
const draftSkills = ref<Set<PrologSlug>>(new Set());

const emit = defineEmits<{
  (
    e: "addCourse",
    payload: { slug: PrologSlug; properties: CourseProperties },
  ): void;
  (e: "removeCourse", slug: PrologSlug): void;
}>();

const canCommit = computed<boolean>(
  () => rawName.value.trim().length > 0 && draftSkills.value.size > 0,
);

const commit = () => {
  if (!canCommit.value) return;
  try {
    emit("addCourse", {
      slug: labelToSlug(rawName.value as HumanLabel, "teacher"),
      properties: { skills: new Set(draftSkills.value) },
    });
    rawName.value = "";
    draftSkills.value.clear();
  } catch (err) {
    console.error(err);
  }
};
</script>

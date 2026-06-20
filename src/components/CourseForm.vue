<template>
  <div>
    <h3>Course Form</h3>
    <NameInput
      v-model="rawName"
      v-model:valid="isValidName"
      placeholder="Course name"
      @enter-pressed="commit"
    />
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
import NameInput from "./NameInput.vue";
import { computed, ref } from "vue";
import SkillSelector from "./SkillSelector.vue";
import type { HumanLabel, PrologSlug } from "../types/slugLabel";
import { labelToSlug, slugToLabel } from "../functions/slugify";

type CourseSlug = PrologSlug<"course">;

export interface CourseProperties {
  skills: Set<PrologSlug<"skill">>;
}

defineProps<{
  skills: Set<PrologSlug<"skill">>;
  courses: Map<CourseSlug, CourseProperties>;
}>();

const rawName = ref<string>("");
const isValidName = ref<boolean>(false);
const draftSkills = ref<Set<PrologSlug<"skill">>>(new Set());

const emit = defineEmits<{
  (
    e: "addCourse",
    payload: { slug: CourseSlug; properties: CourseProperties },
  ): void;
  (e: "removeCourse", slug: CourseSlug): void;
}>();

const canCommit = computed<boolean>(() => isValidName.value);

const commit = () => {
  if (!canCommit.value) return;
  try {
    emit("addCourse", {
      slug: labelToSlug(rawName.value as HumanLabel, "course"),
      properties: { skills: new Set(draftSkills.value) },
    });
    rawName.value = "";
    draftSkills.value.clear();
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <div id="course-form" class="space-y-4">
    <h3 class="text-lg font-semibold tracking-tight text-foreground">
      Courses
    </h3>

    <NameInput
      id="course-name-input"
      v-model="rawName"
      v-model:valid="isValidName"
      placeholder="Course name"
      @enter-pressed="commit"
      @button-pressed="commit"
    />

    <div v-if="courses.size > 0" class="space-y-2 pt-2">
      <h4 class="text-sm font-medium text-muted-foreground">
        Registered Courses
      </h4>
      <div class="space-y-3 max-w-sm">
        <CourseCard
          v-for="[slug, properties] in courses"
          :key="slug"
          :slug="slug"
          :properties="properties"
          :available-skills="skills"
          @remove="$emit('removeCourse', slug)"
          @update-properties="
            (updatedProperties) =>
              $emit('updateCourse', { slug, properties: updatedProperties })
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NameInput from "./NameInput.vue";
import CourseCard from "./CourseCard.vue";
import type { HumanLabel, PrologSlug } from "../types/slugLabel";
import { labelToSlug } from "../functions/slugify";
import type { CourseProperties } from "../types/form";

type CourseSlug = PrologSlug<"course">;

defineProps<{
  skills: Set<PrologSlug<"skill">>;
  courses: Map<CourseSlug, CourseProperties>;
}>();

const rawName = ref<string>("");
const isValidName = ref<boolean>(false);

const emit = defineEmits<{
  (
    e: "updateCourse",
    payload: { slug: CourseSlug; properties: CourseProperties },
  ): void;
  (e: "removeCourse", slug: CourseSlug): void;
}>();

const commit = () => {
  if (!isValidName.value) return;
  try {
    emit("updateCourse", {
      slug: labelToSlug(rawName.value as HumanLabel, "course"),
      properties: { skills: new Set() },
    });
    rawName.value = "";
  } catch (err) {
    console.error(err);
  }
};
</script>

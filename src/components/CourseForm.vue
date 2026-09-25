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

    <div class="max-w-sm">
      <SkillSelector :available-skills="skills" v-model="draftSkills" />
    </div>

    <Button
      id="add-course-button"
      :disabled="!canCommit"
      class="w-full max-w-sm"
      @click="commit"
    >
      Add Course
    </Button>

    <div v-if="courses.size > 0" class="space-y-2 pt-2">
      <h4 class="text-sm font-medium text-muted-foreground">
        Registered Courses
      </h4>
      <ul class="space-y-2 max-w-sm">
        <li
          v-for="[slug, properties] in courses"
          :key="slug"
          class="flex items-center justify-between gap-2 p-2 rounded-md border border-border bg-card text-card-foreground text-sm shadow-xs"
        >
          <div class="flex flex-wrap items-center gap-1.5 min-w-0">
            <span class="font-medium text-foreground">{{
              slugToLabel(slug).label
            }}</span>
            <span
              v-if="properties.skills.size > 0"
              class="text-xs text-muted-foreground"
              >requires:</span
            >
            <SkillPill
              v-for="skillSlug in properties.skills"
              :key="skillSlug"
              :slug="skillSlug"
            />
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            class="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            :aria-label="`Remove course ${slugToLabel(slug).label}`"
            @click="$emit('removeCourse', slug)"
          >
            <PhX :size="14" weight="bold" />
          </Button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import NameInput from "./NameInput.vue";
import SkillSelector from "./SkillSelector.vue";
import SkillPill from "./SkillPill.vue";
import type { HumanLabel, PrologSlug } from "../types/slugLabel";
import { labelToSlug, slugToLabel } from "../functions/slugify";
import type { CourseProperties } from "../types/form";
import { Button } from "@/components/ui/button";
import { PhX } from "@phosphor-icons/vue";

type CourseSlug = PrologSlug<"course">;

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

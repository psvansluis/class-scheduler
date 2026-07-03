<template>
  <div id="teacher-form">
    <h3>Teacher Form</h3>
    <NameInput
      id="teacher-name-input"
      v-model="rawName"
      v-model:valid="isValidName"
      placeholder="Teacher name"
      @enter-pressed="commit"
      @button-pressed="commit"
    />

    <SkillSelector :available-skills="skills" v-model="draftSkills" />

    <button id="add-teacher-button" :disabled="!canCommit" @click="commit">
      Add Teacher
    </button>

    <h4 v-if="teachers.size > 0">Registered Teachers</h4>
    <ul>
      <li v-for="[slug, properties] in teachers" :key="slug">
        <strong>{{ slugToLabel(slug).label }}</strong> can teach:
        <SkillPill
          v-for="skillSlug in properties.skills"
          :key="skillSlug"
          :slug="skillSlug"
        />
        <button @click="$emit('removeTeacher', slug)">❌</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { labelToSlug, slugToLabel } from "../functions/slugify";
import type { HumanLabel, PrologSlug } from "../types/slugLabel";
import SkillSelector from "./SkillSelector.vue";
import NameInput from "./NameInput.vue";
import type { TeacherProperties } from "../types/form";
import SkillPill from "./SkillPill.vue";

defineProps<{
  skills: Set<PrologSlug<"skill">>;
  teachers: Map<PrologSlug<"teacher">, TeacherProperties>;
}>();

const emit = defineEmits<{
  (
    e: "addTeacher",
    payload: { slug: PrologSlug<"teacher">; properties: TeacherProperties },
  ): void;
  (e: "removeTeacher", slug: PrologSlug<"teacher">): void;
}>();

const rawName = ref("");
const isValidName = ref(false);
const draftSkills = ref<Set<PrologSlug<"skill">>>(new Set());

const canCommit = computed<boolean>(() => isValidName.value);

const commit = () => {
  if (!canCommit.value) return;
  try {
    emit("addTeacher", {
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

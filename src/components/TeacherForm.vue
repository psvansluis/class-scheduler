<template>
  <div>
    <h3>Teacher Form</h3>
    <input v-model="rawName" placeholder="Enter teacher name" />

    <select v-model="selectedSkill">
      <option value="" disabled>Select a skill</option>
      <option v-for="slug in skills" :key="slug" :value="slug">
        {{ slugToLabel(slug).label }}
      </option>
    </select>

    <button :disabled="!canCommit" @click="commit">Add Teacher</button>

    <h4>Registered Teachers</h4>
    <ul>
      <li v-for="[slug, properties] in teachers" :key="slug">
        <strong>{{ slugToLabel(slug).label }}</strong> can teach:
        <span v-for="skillSlug in properties.skills" :key="skillSlug">
          [{{ slugToLabel(skillSlug).label }}]
        </span>
        <button @click="$emit('removeTeacher', slug)">❌</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { labelToSlug, slugToLabel } from "../functions/slugify";
import type { HumanLabel, PrologSlug } from "../types/slugLabel";

export interface TeacherProperties {
  skills: Set<PrologSlug>;
}

defineProps<{
  skills: Set<PrologSlug>;
  teachers: Map<PrologSlug, TeacherProperties>;
}>();

const emit = defineEmits<{
  (
    e: "addTeacher",
    payload: { slug: PrologSlug; properties: TeacherProperties },
  ): void;
  (e: "removeTeacher", slug: PrologSlug): void;
}>();

const rawName = ref("");
const selectedSkill = ref<PrologSlug | "">("");

const canCommit = computed(
  () => rawName.value.trim().length > 0 && selectedSkill.value !== "",
);

const commit = () => {
  if (!canCommit.value) return;
  try {
    emit("addTeacher", {
      slug: labelToSlug(rawName.value as HumanLabel, "teacher"),
      properties: { skills: new Set([selectedSkill.value as PrologSlug]) },
    });
    rawName.value = "";
    selectedSkill.value = "";
  } catch (err) {
    console.error(err);
  }
};
</script>

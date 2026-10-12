<template>
  <div id="teacher-form" class="space-y-4">
    <h3 class="text-lg font-semibold tracking-tight text-foreground">
      Teachers
    </h3>

    <NameInput
      id="teacher-name-input"
      v-model="rawName"
      v-model:valid="isValidName"
      placeholder="Teacher name"
      @enter-pressed="commit"
      @button-pressed="commit"
    />

    <div v-if="teachers.size > 0" class="space-y-2 pt-2">
      <h4 class="text-sm font-medium text-muted-foreground">
        Registered Teachers
      </h4>
      <div class="space-y-3 max-w-sm">
        <TeacherCard
          v-for="[slug, properties] in teachers"
          :key="slug"
          :slug="slug"
          :properties="properties"
          :available-skills="skills"
          @remove="$emit('removeTeacher', slug)"
          @update-properties="
            (updatedProperties) =>
              $emit('updateTeacher', { slug, properties: updatedProperties })
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { labelToSlug } from "../functions/slugify";
import type { HumanLabel, PrologSlug } from "../types/slugLabel";
import NameInput from "./NameInput.vue";
import TeacherCard from "./TeacherCard.vue";
import type { TeacherProperties } from "../types/form";

defineProps<{
  skills: Set<PrologSlug<"skill">>;
  teachers: Map<PrologSlug<"teacher">, TeacherProperties>;
}>();

const emit = defineEmits<{
  (
    e: "updateTeacher",
    payload: { slug: PrologSlug<"teacher">; properties: TeacherProperties },
  ): void;
  (e: "removeTeacher", slug: PrologSlug<"teacher">): void;
}>();

const rawName = ref("");
const isValidName = ref(false);

const commit = () => {
  if (!isValidName.value) return;
  try {
    emit("updateTeacher", {
      slug: labelToSlug(rawName.value as HumanLabel, "teacher"),
      properties: { skills: new Set() },
    });
    rawName.value = "";
  } catch (err) {
    console.error(err);
  }
};
</script>

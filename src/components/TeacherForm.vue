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

    <div class="max-w-sm">
      <SkillSelector :available-skills="skills" v-model="draftSkills" />
    </div>

    <Button
      id="add-teacher-button"
      :disabled="!canCommit"
      class="w-full max-w-sm"
      @click="commit"
    >
      Add Teacher
    </Button>

    <div v-if="teachers.size > 0" class="space-y-2 pt-2">
      <h4 class="text-sm font-medium text-muted-foreground">
        Registered Teachers
      </h4>
      <ul class="space-y-2 max-w-sm">
        <li
          v-for="[slug, properties] in teachers"
          :key="slug"
          class="flex items-center justify-between gap-2 p-2 rounded-md border border-border bg-card text-card-foreground text-sm shadow-xs"
          :style="teacherCardStyle(slug)"
        >
          <div class="flex flex-wrap items-center gap-1.5 min-w-0">
            <strong class="font-medium text-foreground">{{
              slugToLabel(slug).label
            }}</strong>
            <span
              v-if="properties.skills.size > 0"
              class="text-xs text-muted-foreground"
              >can teach:</span
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
            :aria-label="`Remove teacher ${slugToLabel(slug).label}`"
            @click="$emit('removeTeacher', slug)"
          >
            <PhX :size="14" weight="bold" />
          </Button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type StyleValue } from "vue";
import { labelToSlug, slugToLabel } from "../functions/slugify";
import type { HumanLabel, PrologSlug } from "../types/slugLabel";
import SkillSelector from "./SkillSelector.vue";
import NameInput from "./NameInput.vue";
import type { TeacherProperties } from "../types/form";
import SkillPill from "./SkillPill.vue";
import { Button } from "@/components/ui/button";
import { PhX } from "@phosphor-icons/vue";
import { slugToStyle } from "../functions/useSlugColour";

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

const teacherCardStyle = (slug: PrologSlug<any>): StyleValue =>
  slugToStyle(slug, {
    lightnessMin: 85,
    lightnessMax: 95,
    hueMin: 15,
    hueMax: 30,
  });
</script>

<template>
  <div
    class="rounded-md border border-border/60 bg-card p-1.5 space-y-1 shadow-2xs"
    :style="courseStyle"
  >
    <p class="truncate">{{ courseLabel }}</p>
    <span
      class="inline-flex items-center rounded-md px-1.5 py-0.5"
      :style="teacherStyle"
    >
      {{ teacherLabel }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { slugToLabel } from "../functions/slugify";
import { useSlugStyle } from "@/functions/useSlugStyle";
import type { ScheduledClass } from "@/types/schedule";

const props = defineProps<{
  scheduledClass: ScheduledClass;
}>();

const slugToStyle = useSlugStyle();

const courseLabel = computed(
  () => slugToLabel(props.scheduledClass.course).label,
);
const teacherLabel = computed(
  () => slugToLabel(props.scheduledClass.teacher).label,
);

const courseStyle = computed(() =>
  slugToStyle(props.scheduledClass.course, "course"),
);
const teacherStyle = computed(() =>
  slugToStyle(props.scheduledClass.teacher, "teacher"),
);
</script>

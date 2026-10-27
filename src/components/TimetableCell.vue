<template>
  <div class="min-h-20 space-y-1">
    <ScheduledClassCard
      v-for="cls in classes"
      :key="`${cls.course}-${cls.classIndex}`"
      :scheduled-class="cls"
    />
    <div
      v-if="classes.length === 0"
      class="h-full min-h-16 rounded border border-dashed border-border/30"
    />
  </div>
</template>

<script setup lang="ts">
import type { ScheduledClass } from "@/types/schedule.js";
import ScheduledClassCard from "./ScheduledClassCard.vue";

defineProps<{
  classes: ScheduledClass[];
}>();
</script>

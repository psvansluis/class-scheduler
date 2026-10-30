<template>
  <CardHeader class="grid-cols-1 px-4 py-0">
    <div class="flex min-w-0 items-baseline justify-between gap-2">
      <CardTitle class="min-w-0 flex-1 text-base font-semibold leading-normal">
        <Label :for="toggleButtonId">
          {{ title }}
        </Label>
      </CardTitle>
      <div class="flex shrink-0 items-baseline gap-1">
        <CaretToggleButton
          :id="toggleButtonId"
          :expanded="expanded"
          :label="`${expanded ? 'Collapse' : 'Expand'} ${title}`"
          :aria-controls="contentId"
          @toggle="$emit('update:expanded', !expanded)"
        />
        <slot name="actions" />
      </div>
    </div>
    <div
      v-if="!expanded"
      :id="`${contentId}-summary`"
      class="col-span-full flex flex-wrap gap-x-3 gap-y-1 text-sm font-normal"
    >
      <span v-for="(item, index) in summary" :key="index">{{ item }}</span>
    </div>
  </CardHeader>
</template>

<script setup lang="ts">
import { CardHeader, CardTitle } from "@/components/ui/card";
import Label from "./ui/label/Label.vue";
import CaretToggleButton from "./CaretToggleButton.vue";
import { useId } from "vue";

defineProps<{
  title: string;
  expanded: boolean;
  contentId: string;
  summary: string[];
}>();

const toggleButtonId = useId();

defineEmits<{
  (event: "update:expanded", expanded: boolean): void;
}>();
</script>

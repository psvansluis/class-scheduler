<template>
  <CardHeader class="px-4 py-0">
    <CardTitle class="min-w-0 truncate text-base font-semibold">
      <Label :for="toggleButtonId">
        {{ title }}
      </Label>
    </CardTitle>
    <CardAction class="flex items-center gap-1">
      <CaretToggleButton
        :id="toggleButtonId"
        :expanded="expanded"
        :label="`${expanded ? 'Collapse' : 'Expand'} ${title}`"
        :aria-controls="contentId"
        @toggle="$emit('update:expanded', !expanded)"
      />
      <slot name="actions" />
    </CardAction>
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
import { CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import CaretToggleButton from "./CaretToggleButton.vue";
import Label from "./ui/label/Label.vue";
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

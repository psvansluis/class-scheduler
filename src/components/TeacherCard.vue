<template>
  <Card
    class="teacher-card py-4 gap-3 rounded-lg shadow-xs border-border"
    :style="cardStyle"
  >
    <CardHeader class="px-4 py-0">
      <CardTitle class="min-w-0 flex-1">
        <Button
          type="button"
          variant="ghost"
          class="h-auto w-full flex-col items-stretch gap-2 p-0 text-left hover:bg-transparent"
          :aria-expanded="isExpanded"
          :aria-controls="contentId"
          @click="isExpanded = !isExpanded"
        >
          <span class="flex w-full min-w-0 items-center gap-2">
            <span class="truncate text-base font-semibold">{{ label }}</span>
            <PhCaretDown
              :size="14"
              class="ml-auto shrink-0 text-muted-foreground transition-transform duration-200"
              :class="{ 'rotate-180': isExpanded }"
            />
          </span>
          <span
            v-if="!isExpanded"
            class="flex w-full flex-wrap gap-x-3 gap-y-1 text-xs font-normal text-muted-foreground"
          >
            <span>{{ properties.skills.size }} skills</span>
            <span>{{ slotCount }}/40 slots available</span>
          </span>
        </Button>
      </CardTitle>
      <CardAction>
        <Button
          variant="ghost"
          size="icon-xs"
          class="shrink-0 opacity-70 hover:opacity-100 hover:text-destructive hover:bg-destructive/10"
          :aria-label="`Remove teacher ${label}`"
          @click="$emit('remove')"
        >
          <PhX :size="14" weight="bold" />
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent v-if="isExpanded" :id="contentId" class="px-4 space-y-3">
      <SkillSelector
        id="teacher-skill-selector"
        label="Skills"
        :available-skills="availableSkills"
        :model-value="properties.skills"
        @update:model-value="onUpdateSkills"
      />

      <!-- Availability Grid Section -->
      <div class="space-y-1.5 pt-1 border-t border-border/40">
        <div class="flex items-center justify-between">
          <Label
            for="availability-grid-toggle"
            class="text-s font-medium opacity-80"
            >Weekly Availability</Label
          >
          <Button
            id="availability-grid-toggle"
            type="button"
            variant="ghost"
            size="sm"
            class="h-6 px-1.5 text-s hover:text -foreground flex items-center gap-1"
            @click="isGridOpen = !isGridOpen"
          >
            <span>{{ slotCount }}/40 slots</span>
            <PhCaretDown
              :size="12"
              class="transition-transform duration-200"
              :class="{ 'rotate-180': isGridOpen }"
            />
          </Button>
        </div>

        <div v-show="isGridOpen" class="pt-1">
          <TimeslotGrid
            :model-value="slots"
            @update:model-value="onUpdateSlots"
          />
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { slugToLabel } from "../functions/slugify";
import type { PrologSlug } from "../types/slugLabel";
import type { TeacherProperties } from "../types/form";
import { useSlugStyle } from "@/functions/useSlugStyle";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhX, PhCaretDown } from "@phosphor-icons/vue";
import SkillSelector from "./SkillSelector.vue";
import TimeslotGrid from "./TimeslotGrid.vue";
import type { TimeslotId } from "@/functions/timeslots.ts";

const props = defineProps<{
  slug: PrologSlug<"teacher">;
  properties: TeacherProperties;
  availableSkills: Set<PrologSlug<"skill">>;
}>();

const emit = defineEmits<{
  (e: "remove"): void;
  (e: "updateProperties", properties: TeacherProperties): void;
}>();

const isExpanded = ref(true);
const isGridOpen = ref(true);
const contentId = `teacher-card-content-${useId()}`;

const slots = computed(() => props.properties.availableSlots);
const slotCount = computed(() => slots.value.size);

const onUpdateSkills = (skills: Set<PrologSlug<"skill">>) =>
  emit("updateProperties", {
    ...props.properties,
    skills,
  });

const onUpdateSlots = (availableSlots: Set<TimeslotId>) =>
  emit("updateProperties", {
    ...props.properties,
    availableSlots,
  });

const label = computed(() => slugToLabel(props.slug).label);
const slugToStyle = useSlugStyle();
const cardStyle = computed(() => slugToStyle(props.slug, "teacher"));
</script>

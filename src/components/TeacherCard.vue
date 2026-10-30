<template>
  <Card
    class="teacher-card py-4 gap-3 rounded-lg shadow-xs border-border"
    :style="cardStyle"
  >
    <CardHeader class="px-4 py-0">
      <CardTitle class="text-base font-semibold">
        {{ label }}
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
    <CardContent class="px-4 space-y-3">
      <div class="space-y-1.5">
        <span class="text-s font-medium opacity-80">Skills</span>
        <SkillSelector
          :available-skills="availableSkills"
          :model-value="properties.skills"
          @update:model-value="onUpdateSkills"
        />
      </div>

      <!-- Availability Grid Section -->
      <div class="space-y-1.5 pt-1 border-t border-border/40">
        <div class="flex items-center justify-between">
          <span class="text-s font-medium opacity-80">Weekly Availability</span>
          <Button
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
import { computed, ref } from "vue";
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

const isGridOpen = ref(true);

const slots = computed(() => props.properties.availableSlots);
const slotCount = computed(() => slots.value.size);

const onUpdateSkills = (skills: Set<PrologSlug<"skill">>) => {
  emit("updateProperties", {
    ...props.properties,
    skills,
  });
};

const onUpdateSlots = (availableSlots: Set<TimeslotId>) => {
  emit("updateProperties", {
    ...props.properties,
    availableSlots,
  });
};

const label = computed(() => slugToLabel(props.slug).label);
const slugToStyle = useSlugStyle();
const cardStyle = computed(() => slugToStyle(props.slug, "teacher"));
</script>

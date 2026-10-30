<template>
  <Card
    class="teacher-card py-4 gap-3 rounded-lg shadow-xs border-border"
    :style="cardStyle"
  >
    <CollapsibleCardHeader
      :title="label"
      :expanded="isExpanded"
      :content-id="contentId"
      :summary="[
        `${properties.skills.size} ${properties.skills.size === 1 ? 'skill' : 'skills'}`,
        `${slotCount}/40 slots available`,
      ]"
      @update:expanded="isExpanded = $event"
    >
      <template #actions>
        <Button
          variant="ghost"
          size="icon-xs"
          class="shrink-0 opacity-70 hover:opacity-100 hover:text-destructive hover:bg-destructive/10"
          :aria-label="`Remove teacher ${label}`"
          @click="$emit('remove')"
        >
          <PhX :size="14" weight="bold" />
        </Button>
      </template>
    </CollapsibleCardHeader>
    <CardContent v-show="isExpanded" :id="contentId" class="px-4 space-y-3">
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
            class="text-sm font-medium opacity-80"
            >Weekly Availability</Label
          >
          <CaretToggleButton
            id="availability-grid-toggle"
            label="Toggle weekly availability grid"
            :expanded="isGridOpen"
            @toggle="isGridOpen = !isGridOpen"
          >
            <span>{{ slotCount }}/40 slots</span>
          </CaretToggleButton>
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhX } from "@phosphor-icons/vue";
import CollapsibleCardHeader from "./CollapsibleCardHeader.vue";
import CaretToggleButton from "./CaretToggleButton.vue";
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

<template>
  <Card
    class="course-card py-4 gap-3 shadow-xs border-border"
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
          :aria-label="`Remove course ${label}`"
          @click="$emit('remove')"
        >
          <PhX :size="14" weight="bold" />
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent class="px-4 space-y-3">
      <!-- Required Skills -->
      <div class="space-y-1.5">
        <span class="text-xs font-medium opacity-80">Required Skills</span>
        <SkillSelector
          :available-skills="availableSkills"
          :model-value="properties.skills"
          @update:model-value="onUpdateSkills"
        />
      </div>

      <!-- Classes per week stepper -->
      <div class="space-y-1.5 pt-1 border-t border-border/40">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium opacity-80">Classes / Week</span>
          <div class="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              class="h-6 w-6"
              :disabled="classCount <= 1"
              aria-label="Decrease class count"
              @click="updateClassCount(-1)"
            >
              <PhMinus :size="12" />
            </Button>
            <span class="w-5 text-center font-mono text-xs font-semibold">
              {{ classCount }}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              class="h-6 w-6"
              :disabled="classCount >= 10"
              aria-label="Increase class count"
              @click="updateClassCount(1)"
            >
              <PhPlus :size="12" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Spacing / Block Constraints -->
      <div class="space-y-1.5 pt-1 border-t border-border/40">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium opacity-80">Constraints</span>
          <span
            v-if="classCount < 2"
            class="text-[10px] text-muted-foreground italic"
          >
            Requires 2+ classes
          </span>
        </div>
        <div class="grid grid-cols-1 gap-1.5 pt-0.5">
          <button
            type="button"
            :disabled="classCount < 2"
            :class="[
              'flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer',
              isDoubleBlock
                ? 'bg-primary/10 border-primary text-foreground font-medium'
                : 'bg-background hover:bg-muted/50 border-border/60 text-muted-foreground',
              classCount < 2
                ? 'opacity-40 cursor-not-allowed pointer-events-none'
                : '',
            ]"
            @click="toggleConstraint('double-block')"
          >
            <span>Schedule as double-block</span>
            <span v-if="isDoubleBlock" class="text-primary font-bold">✓</span>
          </button>
          <button
            type="button"
            :disabled="classCount < 2"
            :class="[
              'flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer',
              isSpreadDays
                ? 'bg-primary/10 border-primary text-foreground font-medium'
                : 'bg-background hover:bg-muted/50 border-border/60 text-muted-foreground',
              classCount < 2
                ? 'opacity-40 cursor-not-allowed pointer-events-none'
                : '',
            ]"
            @click="toggleConstraint('spread-days')"
          >
            <span>Spread over different days</span>
            <span v-if="isSpreadDays" class="text-primary font-bold">✓</span>
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { slugToLabel } from "../functions/slugify";
import type { PrologSlug } from "../types/slugLabel";
import type { CourseConstraint, CourseProperties } from "../types/form";
import { useSlugStyle } from "@/functions/useSlugStyle";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhX, PhPlus, PhMinus } from "@phosphor-icons/vue";
import SkillSelector from "./SkillSelector.vue";

const props = defineProps<{
  slug: PrologSlug<"course">;
  properties: CourseProperties;
  availableSkills: Set<PrologSlug<"skill">>;
}>();

const emit = defineEmits<{
  (e: "remove"): void;
  (e: "updateProperties", properties: CourseProperties): void;
}>();

const classCount = computed(() => props.properties.classCount ?? 1);
const constraints = computed(() => props.properties.constraints ?? []);

const isDoubleBlock = computed(() =>
  constraints.value.some((c) => c.type === "double-block"),
);

const isSpreadDays = computed(() =>
  constraints.value.some((c) => c.type === "spread-days"),
);

const onUpdateSkills = (skills: Set<PrologSlug<"skill">>) => {
  emit("updateProperties", {
    ...props.properties,
    skills,
    classCount: classCount.value,
    constraints: constraints.value,
  });
};

const updateClassCount = (delta: number) => {
  const newCount = Math.max(1, Math.min(10, classCount.value + delta));
  let updatedConstraints = constraints.value;
  if (newCount < 2) {
    updatedConstraints = [];
  }
  emit("updateProperties", {
    ...props.properties,
    classCount: newCount,
    constraints: updatedConstraints,
  });
};

const toggleConstraint = (type: "double-block" | "spread-days") => {
  const isCurrentlyActive = constraints.value.some((c) => c.type === type);
  const nextConstraints: CourseConstraint[] = isCurrentlyActive
    ? []
    : [{ type }];
  emit("updateProperties", {
    ...props.properties,
    constraints: nextConstraints,
  });
};

const label = computed(() => slugToLabel(props.slug).label);
const slugToStyle = useSlugStyle();
const cardStyle = computed(() => slugToStyle(props.slug, "course"));
</script>

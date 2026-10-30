<template>
  <Card
    class="course-card py-4 gap-3 rounded-lg shadow-xs border-border"
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
        <Label
          for="course-skill-selector"
          class="text-xs font-medium opacity-80"
          >Required Skills</Label
        >
        <SkillSelector
          id="course-skill-selector"
          :available-skills="availableSkills"
          :model-value="properties.skills"
          @update:model-value="onUpdateSkills"
        />
      </div>

      <!-- Classes per week stepper -->
      <div class="space-y-1.5 pt-1 border-t border-border/40">
        <div class="flex items-center justify-between">
          <NumberField
            id="course-class-count-field"
            :model-value="classCount"
            :min="1"
            :max="10"
            :step="1"
            :format-options="{ maximumFractionDigits: 0 }"
            class="w-[7.5rem]"
            @update:model-value="updateClassCount"
          >
            <Label
              class="text-xs font-medium opacity-80"
              for="course-class-count-field"
            >
              Classes / Week
            </Label>
            <NumberFieldContent>
              <NumberFieldDecrement aria-label="Decrease classes per week">
                <PhMinus :size="12" />
              </NumberFieldDecrement>
              <NumberFieldInput
                aria-label="Classes per week"
                class="h-7 border-0 px-7 font-mono text-xs font-semibold shadow-none focus-visible:ring-0"
              />
              <NumberFieldIncrement aria-label="Increase classes per week">
                <PhPlus :size="12" />
              </NumberFieldIncrement>
            </NumberFieldContent>
          </NumberField>
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
          <Button
            v-for="constraint in constraintButtons"
            :key="constraint.type"
            type="button"
            :disabled="constraint.disabled"
            :class="[
              'flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer',
              constraint.isActive
                ? 'bg-primary/10 border-primary text-foreground font-medium'
                : 'bg-background hover:bg-muted/50 border-border/60 text-muted-foreground',
            ]"
            @click="toggleConstraint(constraint.type)"
          >
            <span>{{ constraint.label }}</span>
            <span v-if="constraint.isActive" class="text-foreground font-bold"
              >✓</span
            >
          </Button>
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
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
const constraints = computed(
  (): CourseConstraint[] => props.properties.constraints ?? [],
);

const isDoubleBlock = computed(() =>
  constraints.value.some((c) => c.type === "double-block"),
);

const isSpreadDays = computed(() =>
  constraints.value.some((c) => c.type === "spread-days"),
);

const constraintButtons = computed(
  (): {
    type: "double-block" | "spread-days";
    label: string;
    isActive: boolean;
    disabled: boolean;
  }[] => [
    {
      type: "double-block",
      label: "Schedule as double-block",
      isActive: isDoubleBlock.value,
      disabled: classCount.value < 2,
    },
    {
      type: "spread-days",
      label: "Spread over different days",
      isActive: isSpreadDays.value,
      disabled: classCount.value < 2,
    },
  ],
);

const onUpdateSkills = (skills: Set<PrologSlug<"skill">>) => {
  emit("updateProperties", {
    ...props.properties,
    skills,
    classCount: classCount.value,
    constraints: constraints.value,
  });
};

const updateClassCount = (newCount: number | undefined) => {
  if (newCount === undefined) return;
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

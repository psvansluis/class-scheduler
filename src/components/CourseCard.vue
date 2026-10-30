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
      <SkillSelector
        id="course-skill-selector"
        label="Required Skills"
        :available-skills="availableSkills"
        :model-value="properties.skills"
        @update:model-value="onUpdateSkills"
      />

      <div class="space-y-1.5 pt-1 border-t border-border/40">
        <div class="flex items-center justify-between">
          <NumericStepper
            id="course-class-count-field"
            label="Classes per week"
            test-id="class-count"
            :model-value="classCount"
            :min="1"
            :max="10"
            @update:model-value="updateClassCount"
          >
            <template #label>
              <Label
                class="text-s font-medium opacity-80"
                for="course-class-count-field"
              >
                Classes / Week
              </Label>
            </template>
          </NumericStepper>
        </div>
      </div>

      <div class="space-y-1.5 pt-1 border-t border-border/40">
        <div class="flex items-center justify-between">
          <span class="text-s font-medium opacity-80">Constraints</span>
          <span
            v-if="classCount < 2"
            class="text-[10px] text-muted-foreground italic"
          >
            Requires 2+ classes
          </span>
        </div>
        <div class="grid grid-cols-1 gap-2 pt-0.5">
          <div v-for="constraint in constraintFields" :key="constraint.type">
            <CourseConstraintField
              :id="constraint.id"
              :label="constraint.label"
              :test-id="constraint.testId"
              :enabled="constraint.enabled"
              :model-value="constraint.value"
              :min="constraint.min"
              :max="constraint.max"
              :disabled="classCount < 2"
              @update:enabled="constraint.toggle"
              @update:model-value="constraint.update"
            />
          </div>
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
import { PhX } from "@phosphor-icons/vue";

import SkillSelector from "./SkillSelector.vue";
import CourseConstraintField from "./CourseConstraintField.vue";
import NumericStepper from "./NumericStepper.vue";

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

const blockLength = computed(
  () =>
    constraints.value.find((c) => c.type === "successive")?.blockLength ?? 2,
);
const dayGap = computed(
  () => constraints.value.find((c) => c.type === "min_day_gap")?.gap ?? 0,
);
const constraintFields = computed(() => [
  {
    type: "successive" as const,
    label: "Consecutive classes per block",
    testId: "block-length",
    id: `course-${props.slug}-block-length`,
    value: blockLength.value,
    enabled: constraints.value.some((c) => c.type === "successive"),
    min: 2,
    max: classCount.value,
    toggle: toggleSuccessive,
    update: updateSuccessiveLength,
  },
  {
    type: "min_day_gap" as const,
    label: "Full days between blocks",
    testId: "day-gap",
    id: `course-${props.slug}-day-gap`,
    value: dayGap.value,
    enabled: constraints.value.some((c) => c.type === "min_day_gap"),
    min: 0,
    max: 4,
    toggle: toggleDayGap,
    update: updateDayGap,
  },
]);

const updateProperties = (properties: Partial<CourseProperties>) =>
  emit("updateProperties", { ...props.properties, ...properties });

const onUpdateSkills = (skills: Set<PrologSlug<"skill">>) =>
  updateProperties({
    skills,
    classCount: classCount.value,
    constraints: constraints.value,
  });

const updateClassCount = (newCount: number | undefined) => {
  if (newCount === undefined) return;
  const newConstraints = newCount < 2 ? [] : constraints.value;
  updateProperties({
    classCount: newCount,
    constraints: newConstraints,
  });
};

const replaceConstraint = (nextConstraint: CourseConstraint) => {
  const nextConstraints = constraints.value.filter(
    (constraint) => constraint.type !== nextConstraint.type,
  );
  nextConstraints.push(nextConstraint);
  updateProperties({ constraints: nextConstraints });
};

const removeConstraint = (type: CourseConstraint["type"]) =>
  updateProperties({
    constraints: constraints.value.filter(
      (constraint) => constraint.type !== type,
    ),
  });

const updateSuccessiveLength = (newValue: number | undefined) => {
  if (newValue === undefined || !Number.isFinite(newValue)) return;
  replaceConstraint({
    type: "successive",
    blockLength: Math.min(Math.max(Math.trunc(newValue), 2), classCount.value),
  });
};

const updateDayGap = (newValue: number | undefined) => {
  if (newValue === undefined || !Number.isFinite(newValue)) return;
  replaceConstraint({
    type: "min_day_gap",
    gap: Math.min(Math.max(Math.trunc(newValue), 0), 4),
  });
};

const toggleSuccessive = (enabled: boolean) =>
  enabled
    ? replaceConstraint({ type: "successive", blockLength: blockLength.value })
    : removeConstraint("successive");

const toggleDayGap = (enabled: boolean) =>
  enabled
    ? replaceConstraint({ type: "min_day_gap", gap: dayGap.value })
    : removeConstraint("min_day_gap");

const label = computed(() => slugToLabel(props.slug).label);
const slugToStyle = useSlugStyle();
const cardStyle = computed(() => slugToStyle(props.slug, "course"));
</script>

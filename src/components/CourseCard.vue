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
    <CardContent class="px-4">
      <div class="space-y-1.5">
        <span class="text-xs font-medium opacity-80">Required Skills</span>
        <SkillSelector
          :available-skills="availableSkills"
          :model-value="properties.skills"
          @update:model-value="onUpdateSkills"
        />
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { slugToLabel } from "../functions/slugify";
import type { PrologSlug } from "../types/slugLabel";
import type { CourseProperties } from "../types/form";
import { useSlugStyle } from "@/functions/useSlugStyle";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhX } from "@phosphor-icons/vue";
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

const onUpdateSkills = (skills: Set<PrologSlug<"skill">>) => {
  emit("updateProperties", {
    ...props.properties,
    skills,
  });
};

const label = computed(() => slugToLabel(props.slug).label);
const slugToStyle = useSlugStyle();
const cardStyle = computed(() => slugToStyle(props.slug, "course"));
</script>

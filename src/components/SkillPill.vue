<template>
  <div
    class="skill-pill group relative gap-2 p-2 inline-flex rounded-lg border border-border bg-card text-card-foreground text-sm shadow-xs transition-all px-3"
    :style="pillStyle"
  >
    <span class="pill-label whitespace-nowrap font-medium select-none">{{
      label
    }}</span>
    <button
      v-if="removable"
      type="button"
      class="delete-btn absolute -top-2 -right-2 flex size-4.5 items-center justify-center rounded-full border border-black/20 bg-background text-foreground/80 shadow-xs transition-transform duration-150 scale-75 group-hover:scale-100 hover:scale-110 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive cursor-pointer"
      :aria-label="`Remove skill ${label}`"
      @click="$emit('removeSkill')"
    >
      <PhTrashSimple :size="11" weight="bold" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { slugToLabel } from "../functions/slugify";
import { slugToStyle } from "../functions/useSlugColour";
import type { PrologSlug } from "../types/slugLabel";
import { PhTrashSimple } from "@phosphor-icons/vue";

const props = withDefaults(
  defineProps<{
    slug: PrologSlug<"skill">;
    removable?: boolean;
  }>(),
  {
    removable: false,
  },
);

defineEmits<{
  (e: "removeSkill"): void;
}>();

const label = computed(() => slugToLabel(props.slug).label);

const pillStyle = computed(() => slugToStyle(props.slug));
</script>

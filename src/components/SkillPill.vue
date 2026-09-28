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
import { colord } from "colord";
import { getCurrentTheme } from "../functions/useCurrentTheme";
import { slugToLabel } from "../functions/slugify";
import { slugToStyle, type SlugColourConfig } from "../functions/useSlugColour";
import type { PrologSlug } from "../types/slugLabel";
import { PhTrashSimple } from "@phosphor-icons/vue";
import type { Theme } from "@/functions/theme";

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

const theme = getCurrentTheme();

const themeSlugColourConfigs: Record<Theme, SlugColourConfig> = {
  corporate: {
    hueMin: 135,
    hueMax: 195,
    satMin: 70,
    satMax: 85,
    lightnessMin: 70,
    lightnessMax: 80,
  },
  gothic: {
    hueMin: 310,
    hueMax: 10,
    satMin: 70,
    satMax: 85,
    lightnessMin: 15,
    lightnessMax: 25,
    textOnDark: colord("#c0c0c0"),
  },
};

const pillStyle = computed(() =>
  slugToStyle(props.slug, themeSlugColourConfigs[theme.value ?? "corporate"]),
);
</script>

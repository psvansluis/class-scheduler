<template>
  <div class="skill-pill" :style="pillStyle">
    <span class="pill-label">{{ label }}</span>
    <button
      class="material-icons-outlined delete-btn"
      v-if="removable"
      @click="$emit('removeSkill')"
    >
      delete
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { slugToLabel } from "../functions/slugify";
import "@material-design-icons/font";
import { useSlugColour } from "../functions/useSlugColour";
import type { PrologSlug } from "../types/slugLabel";

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

const pillStyle = computed(() => {
  const { bgColour, textColour } = useSlugColour(props.slug);
  return {
    backgroundColor: bgColour.toRgbString(),
    color: textColour.toRgbString(),
  };
});
</script>

<style scoped>
.skill-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  color: black;
  border: 2px solid rgb(102, 102, 102);
  border-radius: 7px;
  margin: 5px;
  padding: 6px 10px;
  box-sizing: border-box;
  transition: padding 0.2s ease;
}

.pill-label {
  font-weight: 500;
  white-space: nowrap;
}

.skill-pill .delete-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  font-size: 0.95rem;
  color: rgb(102, 102, 102);
  background-color: #ffffff7e;
  border: 1.5px solid rgb(102, 102, 102);
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: scale(0.6);
  transition:
    transform 0.15s ease,
    background-color 0.15s ease;
}

.skill-pill:hover .delete-btn {
  background-color: #ffffff;
  transform: scale(1);
}

.skill-pill .delete-btn:hover {
  background-color: #ffdddd;
  color: #cc0000;
  border-color: #cc0000;
}
</style>

<template>
  <div class="skill-pill" :style="{ backgroundColor: colour }">
    {{ label }}
    <button
      class="material-icons-outlined"
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
import type { PrologSlug } from "../types/slugLabel";
import { hash } from "../functions/hash";

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
const hue = () => 135 + (hash(props.slug) % 60);
const sat = () => 70 + (hash(props.slug) % 15);
const colour = computed(() => `hsl(${hue()}, ${sat()}%, 70%)`);
</script>

<style scoped>
.skill-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: black;
  border: 2px solid rgb(102, 102, 102);
  border-radius: 7px;
  margin: 5px;
  padding: 5px;
}

.skill-pill button {
  color: rgba(102, 102, 102, 0.8);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.5s ease-in;
  font-size: 1.2em;
}

.skill-pill button:hover {
  color: rgba(102, 102, 102, 1);
  transform: scale(1.2);
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
}
</style>

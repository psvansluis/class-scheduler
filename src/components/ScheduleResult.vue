<template>
  <h2>Generated Schedule Grid</h2>
  <input v-model="typePrefix" placeholder="Enter a type prefix" />
  <input v-model="label" placeholder="Enter a label" />
  <p>Generated Slug: {{ slug }}</p>
  <p>Back to Label: {{ labelBack }}</p>
</template>

<script setup lang="ts">
import { computed, ref, type ComputedRef } from "vue";
import { labelToSlug, slugToLabel } from "../functions/slugify";
import type { HumanLabel, TypePrefix } from "../types/slugLabel";

const typePrefix = ref<TypePrefix | undefined>(undefined);
const label = ref<HumanLabel | undefined>(undefined);
const slug = computed(() => {
  console.log("Label value:", label.value);
  return label.value && typePrefix.value
    ? labelToSlug(label.value, typePrefix.value)
    : "no slug yet";
});

const labelBack: ComputedRef<
  | {
      label: HumanLabel;
      typePrefix: TypePrefix;
    }
  | "no label yet"
> = computed(() => {
  if (!slug.value || slug.value === "no slug yet") return "no label yet";
  return slugToLabel(slug.value);
});
</script>

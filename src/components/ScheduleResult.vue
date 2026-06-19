<template>
  <h2>Generated Schedule Grid</h2>
  <input v-model="typePrefix" placeholder="Enter a type prefix" />
  <input v-model="label" placeholder="Enter a label" />
  <p v-if="slug">Generated Slug: {{ slug }}</p>
  <p v-if="labelBack">
    Back to Label: "{{ labelBack.label }}"" with type prefix "{{
      labelBack.typePrefix
    }}"
  </p>
</template>

<script setup lang="ts">
import { computed, ref, type ComputedRef } from "vue";
import { labelToSlug, slugToLabel } from "../functions/slugify";
import type { HumanLabel, TypePrefix } from "../types/slugLabel";

const typePrefix = ref<TypePrefix | undefined>(undefined);
const label = ref<HumanLabel | undefined>(undefined);
const slug = computed(() =>
  label.value && typePrefix.value
    ? labelToSlug(label.value, typePrefix.value)
    : undefined,
);

const labelBack: ComputedRef<
  | {
      label: HumanLabel;
      typePrefix: TypePrefix;
    }
  | undefined
> = computed(() => (slug.value ? slugToLabel(slug.value) : undefined));
</script>

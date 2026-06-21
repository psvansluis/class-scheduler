<template>
  <router-link v-bind="$attrs" :to="{ name: name, query: $route.query }">
    <slot />
  </router-link>
</template>

<script setup lang="ts">
import type { RouteName } from "./config";

const props = defineProps<{
  name: RouteName;
}>();
</script>

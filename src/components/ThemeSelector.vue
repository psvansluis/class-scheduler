<template>
  <div class="flex items-center gap-2">
    <Select :model-value="theme" @update:model-value="selectTheme">
      <SelectTrigger
        id="theme-select"
        aria-label="Theme"
        class="bg-background/70 w-36"
      >
        <SelectValue>Choose a theme...</SelectValue>
      </SelectTrigger>
      <SelectContent class="bg-background/70">
        <SelectItem v-for="t in themes" :key="t.value" :value="t.value">
          {{ t.label }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const themes = [
  { label: "Corporate", value: "corporate" },
  { label: "Gothic", value: "gothic" },
] as const;

type Theme = (typeof themes)[number]["value"];

const route = useRoute();
const router = useRouter();
const theme = ref<Theme>("corporate");
const darkPreference = window.matchMedia("(prefers-color-scheme: dark)");
const fallbackTheme: Theme = darkPreference.matches ? "gothic" : "corporate";

const parseTheme = (value: unknown): Theme | undefined =>
  themes.find((t) => t.value === value)?.value;

const applyTheme = (value: Theme) =>
  (document.documentElement.dataset.theme = value);

const syncThemeFromUrl = () => {
  const parsedTheme = parseTheme(route.query.theme) ?? fallbackTheme;
  theme.value = parsedTheme;
  applyTheme(theme.value);
};

const selectTheme = (value: unknown) => {
  const selectedTheme = parseTheme(value);
  if (!selectedTheme) return;

  router.push({
    name: route.name ?? undefined,
    query: { ...route.query, theme: selectedTheme },
  });
};

watch(() => route.query.theme, syncThemeFromUrl, { immediate: true });
</script>

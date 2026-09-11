---
id: 004
title: Extract a slug-based colour composable from SkillPill.vue
status: open # open | in-progress | closed
priority: medium # low | medium | high
assignee:
labels: [refactor, composable, theming]
created: 2026-09-11
---

# 004 - Extract a slug-based colour composable from SkillPill.vue

## Background

`src/components/SkillPill.vue` currently computes a background colour inline from a slug hash:

```ts
const hue = () => 135 + (hash(props.slug) % 60); // greens: 135–195°
const sat = () => 70 + (hash(props.slug) % 15); // 70–85%
const colour = computed(() => `hsl(${hue()}, ${sat()}%, 70%)`);
```

The text colour is hardcoded as `color: black` in the scoped CSS, which breaks on dark themes. This logic should be extracted into a reusable composable that:

- Is theme-aware (adjusts lightness for light vs dark modes)
- Produces a contrast-safe text colour automatically
- Accepts an optional per-theme hue range override (so Gothic theme can use silver/purple tones, 70s theme can use amber/orange, etc.)

## Dependency

Can be worked on independently of ticket 001, but the composable should be migrated into the shadcn-vue + Tailwind structure established there. The composable itself is pure TypeScript logic and has no framework dependency.

## Proposed API

```ts
// src/composables/useSlugColour.ts
import { computed, type Ref } from "vue";
import { hash } from "../functions/hash";

interface SlugColourOptions {
  /** Hue range start in degrees. Default: 135 (green) */
  hueBase?: number;
  /** Hue range width in degrees. Default: 60 */
  hueRange?: number;
}

export function useSlugColour(
  slug: Ref<string>,
  isDark: Ref<boolean>,
  options: SlugColourOptions = {},
) {
  const { hueBase = 135, hueRange = 60 } = options;

  const hue = computed(() => hueBase + (hash(slug.value) % hueRange));
  const sat = computed(() => 70 + (hash(slug.value) % 15));

  // Light theme: high lightness pastels → dark text
  // Dark theme:  mid lightness rich tones → light text
  const lightness = computed(() => (isDark.value ? 38 : 72));

  const bgColour = computed(
    () => `hsl(${hue.value}, ${sat.value}%, ${lightness.value}%)`,
  );

  // WCAG approximate: L > 55% → dark text safe; L < 55% → light text safe
  const textColour = computed(() =>
    lightness.value > 55 ? "#1a1a1a" : "#f0f0f0",
  );

  return { bgColour, textColour };
}
```

## Theme hue range suggestions

| Theme            | hueBase | hueRange | Feel                              |
| ---------------- | ------- | -------- | --------------------------------- |
| Default          | 135     | 60       | Greens (current)                  |
| Gothic           | 240     | 60       | Blues → purples (silver-adjacent) |
| Corporate        | 200     | 40       | Cool blues                        |
| Sacred Scheduler | 30      | 80       | Yellows → pinks                   |
| Seventies        | 20      | 50       | Ambers → oranges                  |

## `isDark` source

The `isDark` ref should come from:

1. A global theme composable / provide-inject (preferred once ticket 003 is implemented)
2. `window.matchMedia('(prefers-color-scheme: dark)')` as a reactive ref (interim, before ticket 003)

Consider a shared `useTheme()` composable that exposes `isDark`, `themeName`, and `setTheme()`.

## Usage after extraction

```vue
<!-- SkillPill.vue -->
<script setup lang="ts">
import { useSlugColour } from "../composables/useSlugColour";
import { useTheme } from "../composables/useTheme";

const { isDark, hueBase, hueRange } = useTheme();
const { bgColour, textColour } = useSlugColour(toRef(props, "slug"), isDark, {
  hueBase,
  hueRange,
});
</script>

<template>
  <div
    class="skill-pill"
    :style="{ backgroundColor: bgColour, color: textColour }"
  >
    ...
  </div>
</template>
```

## Acceptance Criteria

- [ ] `useSlugColour` composable extracted to `src/composables/useSlugColour.ts`
- [ ] `SkillPill.vue` uses the composable instead of inline logic
- [ ] Text colour is computed (not hardcoded), contrast-safe for light and dark modes
- [ ] Composable accepts optional `hueBase` and `hueRange` parameters
- [ ] A `useTheme()` composable (or equivalent) provides `isDark` reactively
- [ ] Existing colour-per-slug behaviour is visually unchanged on the default light theme

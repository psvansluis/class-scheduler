---
id: 004
title: Extract a slug-based colour composable from SkillPill.vue
status: open # open | in-progress | closed
priority: medium # low | medium | high
assignee:
labels: [refactor, composable, a11y]
created: 2026-09-11
---

# 004 - Extract a slug-based colour composable from SkillPill.vue

## Background

`src/components/SkillPill.vue` currently computes background colour inline from a slug hash:

```ts
const hue = () => 135 + (hash(props.slug) % 60); // greens: 75–195°
const sat = () => 70 + (hash(props.slug) % 15); // 55–85%
const colour = computed(() => `hsl(${hue()}, ${sat()}%, 70%)`);
```

The text colour is hardcoded as `color: black` in scoped CSS, which breaks on dark backgrounds. Furthermore, the colour bounds and variations are locked inside this single component.

This logic should be extracted into a reusable, framework-independent composable (`useSlugColour`) that:

- Is completely decoupled from specific themes (themes supply the configuration; the composable merely executes the math)
- Accepts ranges for **Hue**, **Saturation**, and **Lightness** (`Min` / `Max` bounds)
- Correctly supports **Hue wrapping** across 360° (e.g., reds spanning 340° to 20°)
- Computes contrast-safe text colour by evaluating accessibility (WCAG contrast score) between `textOnLight` vs. `textOnDark` against the computed background colour

NB: the current `hash` function produces both negative and positive numbers.

## Design Decisions

1. **Option B (Explicit Component Config):** SkillPill (and other components like future teacher pills) explicitly passes a configuration to `useSlugColour`. This avoids hidden global coupling and allows different pill types to use distinct colour ranges (e.g. green for skills, orange for teachers).
2. **Min/Max API:** All colour parameters use intuitive `Min` and `Max` bounds. If `Min === Max`, the value is fixed.
3. **Hue Wrapping:** Angular distances wrap around 360°. For example, `hueMin: 350` and `hueMax: 20` creates a span of 30° (`[350, 360) U [0, 20)`).
4. **Contrast Safety:** Uses WCAG relative luminance contrast calculation (or a lightweight library like `colord` with its a11y plugin) to compare `textOnLight` and `textOnDark` against the generated background, automatically selecting the one with the higher contrast ratio (or meeting WCAG AA 4.5:1).

## Proposed API

```ts
// src/composables/useSlugColour.ts
import { computed, type MaybeRefOrGetter, toValue } from "vue";
import { hash } from "../functions/hash";

export interface SlugColourConfig {
  /** Hue lower bound [0-360]. Default: 135 */
  hueMin?: number;
  /** Hue upper bound [0-360]. Can be less than hueMin to support wrapping around 360. Default: 195 */
  hueMax?: number;
  /** Saturation lower bound [0-100]. Default: 70 */
  satMin?: number;
  /** Saturation upper bound [0-100]. Default: 85 */
  satMax?: number;
  /** Lightness lower bound [0-100]. Default: 70 */
  lightnessMin?: number;
  /** Lightness upper bound [0-100]. Default: 70 */
  lightnessMax?: number;
  /** Text colour candidate for lighter backgrounds. Default: '#000000' */
  textOnLight?: string;
  /** Text colour candidate for darker backgrounds. Default: '#ffffff' */
  textOnDark?: string;
}

export function useSlugColour(
  slug: MaybeRefOrGetter<string>,
  config?: MaybeRefOrGetter<SlugColourConfig>,
) {
  // 1. Calculate hue with wrapping:
  //    span = hueMax >= hueMin ? (hueMax - hueMin) : (360 - hueMin + hueMax)
  //    hue = (hueMin + (hash % (span || 1))) % 360
  // 2. Calculate sat: satMin + (hash % ((satMax - satMin) || 1))
  // 3. Calculate lightness: lightnessMin + (hash % ((lightnessMax - lightnessMin) || 1))
  // 4. Background: hsl(hue, sat%, lightness%)
  // 5. Evaluate contrast ratio of textOnLight vs bg and textOnDark vs bg; select the winner
  return { bgColour, textColour, hue, sat, lightness };
}
```

## Usage in `SkillPill.vue`

```vue
<script setup lang="ts">
import { computed } from "vue";
import {
  useSlugColour,
  type SlugColourConfig,
} from "../composables/useSlugColour";

const props = defineProps<{
  slug: string;
  colourConfig?: SlugColourConfig;
}>();

// Uses passed config or defaults preserving existing behaviour
const { bgColour, textColour } = useSlugColour(
  () => props.slug,
  () => props.colourConfig,
);
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

## Related Issues

- **003** — Theme system. Ticket 003 is responsible for `useTheme()`, reactive `isDark`, and providing theme-appropriate `SlugColourConfig` presets (such as silver accents for Gothic or warm ambers for Seventies).

## Acceptance Criteria

- [ ] `useSlugColour` composable extracted to `src/composables/useSlugColour.ts`
- [ ] Supports `hueMin`, `hueMax`, `satMin`, `satMax`, `lightnessMin`, `lightnessMax`
- [ ] Hue wrapping around 360° is correctly calculated and verified with unit tests (e.g. 350° to 20°)
- [ ] Text colour automatically selects the higher-contrast option between `textOnLight` (default black) and `textOnDark` (default white) using WCAG contrast calculation
- [ ] `SkillPill.vue` uses `useSlugColour` without breaking existing visual styling on default theme
- [ ] Unit tests cover slug hashing consistency, hue wrapping, and contrast selection

---
id: 003
title: Implement themes (dark, light, serious, playful)
status: open # open | in-progress | closed
priority: medium # low | medium | high
assignee:
labels: [themes, design-system]
created: 2026-09-11
---

# 003 - Implement themes (dark, light, serious, playful)

I build this project for fun and for beauty.

## Dependency

**Ticket 001 must be completed or substantially in progress first.** The theme system is built on top of the shadcn-vue + Tailwind CSS infrastructure established there. Themes are implemented as CSS custom property blocks (`:root`, `[data-theme="..."]`) that override design system token variables.

## Theming Architecture

- Design tokens (`--primary`, `--background`, `--foreground`, `--radius`, etc.) define CSS variables on `<html data-theme="...">`
- **Reactive Theme State:** A `useTheme()` composable manages:
  - Active theme name
  - Reactive `isDark` state (from `prefers-color-scheme` or manual selection)
  - Switching themes and synchronizing with the URL slug (see ticket 002)
- **Component Colour Configuration:** Themes define the visual parameters for components that generate slug-based colours (using `SlugColourConfig` from ticket 004):
  - Different components can receive different ranges (e.g., orange tones for teachers, green/blue for skills)
  - The delivery mechanism (Vue `provide`/`inject` keys or theme store) will be finalized during implementation of this ticket

## Theme Descriptions

### Corporate (light, serious)

Import SLDS visual language as inspiration; make it feel like a Salesforce/Trailhead app.

- Default for light-theme browsers
- Light theme, sans-serif fonts
- Trailhead-style mascot
- Clean, grid-based, professional
- SkillPill range: cool blues/teals (`hueMin: 190, hueMax: 220`)
- Moodboard: <https://www.salesforce.com/blog/meet-trailhead-characters-blog/>

### Original Gothic (dark, serious)

Think Codex Argenteus — the 6th-century silver Bible.

- Default for dark browsers
- Dark purple/brownish background
- Silver text, gold accents (`textOnDark: '#c0c0c0'`)
- Arches as decorative motifs
- Wulfila as the mascot
- Uncial font
- SkillPill range: deep purples/violets (`hueMin: 260, hueMax: 300, lightnessMin: 25, lightnessMax: 35`)
- Moodboard: <https://www.uu.se/en/library/visit-and-contact/exhibitions/codex-argenteus>

### Sacred Scheduler (light, playful)

TempleOS-inspired. Chaotic holiness.

- White background, yellow and pink accents
- Moving/rotating elements
- Black monospace low-res fonts
- Mascot carries a sword and wears a Catholic priest robe
- SkillPill range: vibrant yellows to pinks across 360 wrap (`hueMin: 330, hueMax: 60`)
- Moodboard: <https://templeos.org/>

### Seventies (dark, playful)

Orange patterned carpets, dark wood paneling, retrofuturism.

- Dark wood/orange palette, creamy white accents
- Carpet and wood grain relief textures (CSS or SVG background patterns)
- Square retrofuturistic fonts for headers, serif font for running text
- Mascot is a middle-aged teacher in a checkered cardigan, smoking a pipe
- SkillPill range: warm ambers and oranges (`hueMin: 20, hueMax: 50`)
- Moodboard: <https://parkhotel-1970.de/>

## Implementation Notes

- Each theme is registered via CSS variables targeting `[data-theme="..."]`
- `useTheme()` composable handles browser detection (`window.matchMedia('(prefers-color-scheme: dark)')`) and persistence
- Per-theme fonts loaded via `@font-face` on demand or eager for active theme

## Acceptance Criteria

- [ ] A `useTheme()` composable manages active theme and exposes reactive `isDark`
- [ ] At least one light theme exists and at least one dark theme exists
- [ ] Themes pick up browser defaults (`prefers-color-scheme`) on initial load
- [ ] Themes can be switched manually via UI control
- [ ] Manual theme selection is persisted in the URL slug
- [ ] Theme provides appropriate `SlugColourConfig` palettes for SkillPills and other slug-coloured components
- [ ] Each theme has a distinct font and visual personality

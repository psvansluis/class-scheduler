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

**Ticket 001 must be completed or substantially in progress first.** The theme system is built on top of the shadcn-vue + Tailwind CSS infrastructure established there. Themes are implemented as CSS custom property blocks (`:root`, `[data-theme="..."]`) that override shadcn-vue's token variables.

## Theming Architecture (decided in ticket 001)

- shadcn-vue CSS custom properties (`--primary`, `--background`, `--foreground`, `--radius`, etc.) are the token layer
- Theme swap = swap CSS variable values on `<html data-theme="...">` — no JS re-render required
- **DaisyUI 5** may be used alongside shadcn-vue purely for its 35+ pre-built named themes as token starting points — the two are compatible (both operate on CSS vars on `<html>`)
- Browser default (`prefers-color-scheme`) must be respected as the initial theme fallback
- Manual theme choice must be persisted in the URL slug (see ticket 002 for slug format)

## Description

Suggestions for themes — each is a full visual personality, not just a colour swap:

### Corporate (light, serious)

Import SLDS visual language as inspiration; make it feel like a Salesforce/Trailhead app.

- Light theme, sans-serif fonts (default for light-theme browsers)
- Trailhead-style mascot
- Clean, grid-based, professional
- Moodboard: <https://www.salesforce.com/blog/meet-trailhead-characters-blog/>

### Original Gothic (dark, serious)

Think Codex Argenteus — the 6th-century silver Bible.

- Dark purple/brownish background
- Silver text, gold accents
- Arches as decorative motifs
- Wulfila as the mascot
- Uncial font (default for dark browsers)
- Moodboard: <https://www.uu.se/en/library/visit-and-contact/exhibitions/codex-argenteus>

> Note: the slug-based SkillPill HSL colour range (currently greens, 135–195°) should be narrowed to blues/purples/silvers for this theme. See ticket 004 for the `useSlugColour` composable which accepts per-theme hue range overrides.

### Sacred Scheduler (light, playful)

TempleOS-inspired. Chaotic holiness.

- White background, yellow and pink accents
- Moving/rotating elements
- Black monospace low-res fonts
- Mascot carries a sword and wears a Catholic priest robe
- Moodboard: <https://templeos.org/>

### Seventies (dark, playful)

Orange patterned carpets, dark wood paneling, retrofuturism.

- Dark wood/orange palette, creamy white accents
- Carpet and wood grain relief textures (CSS or SVG background patterns)
- Square retrofuturistic fonts for headers, serif font for running text
- Mascot is a middle-aged teacher in a checkered cardigan, smoking a pipe
- Moodboard: <https://parkhotel-1970.de/>

## Implementation Notes

- Each theme is a CSS block; the selector strategy is `[data-theme="gothic"]`, `[data-theme="corporate"]`, etc. on `<html>`
- The `useSlugColour` composable (ticket 004) should accept an optional hue range override so each theme can tint SkillPills to its own palette
- Fonts are loaded per-theme via `@font-face` — only the active theme's fonts need to be loaded eagerly; others can be deferred
- Decorative elements (mascots, textures) can be injected via CSS `background-image` or a theme-aware Vue component

## Acceptance Criteria

- [ ] At least one light theme exists
- [ ] At least one dark theme exists
- [ ] Themes pick up browser defaults (`prefers-color-scheme`) on first load
- [ ] Themes can be switched manually via a UI control
- [ ] Manual theme choice is persisted in the URL slug
- [ ] Each theme has a distinct font personality (not just a colour swap)
- [ ] SkillPill hue ranges adapt to the active theme

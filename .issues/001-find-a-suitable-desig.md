---
id: 001
title: Find a suitable design system and implement it
status: in-progress # open | in-progress | closed
priority: medium # low | medium | high
assignee:
labels: [design-system, tailwind, shadcn-vue]
created: 2026-09-09
---

# 001 - Find a suitable design system and implement it

## Background

The project is a **Vue 3 + TypeScript + Vite SPA** — a class scheduler. Currently all styling is hand-written in `src/style.css` (global utility classes) and `<style scoped>` blocks inside each component. This has caused several compounding problems:

- Button icon alignment requires manual flexbox juggling per component
- The global utility classes `.app-input-field` and `.app-action-badge` are shared state implicitly relied on across components, but scoped styles prevent consistent visual extension
- Scoped styles are fundamentally at odds with cross-component visual consistency — design tokens (colour, radius, spacing) must be duplicated or threaded through CSS custom properties manually
- Dark/light theme support is partially in place via `@media (prefers-color-scheme: dark)` but hardcoded colour literals (`color: black`, `background-color: white`) in component scoped styles break it

## Requirements

### Must-have

- **Form inputs** — styled text inputs, selects, checkboxes, toggles (replacing `.app-input-field`)
- **Tooltips** — accessible, keyboard-friendly
- **Tables** — at minimum styled HTML tables; sortable/filterable behaviour is a plus
- **Modals / Dialogs** — for confirmations and complex forms
- **Top nav bar** — already exists; must be migrated or compatible
- **Sidebar navigation** — not yet built; must be possible (responsive: sidebar on wide, top-bar on narrow)
- **Badges / Pills / Chips** — for SkillPill and similar; must accept dynamic computed inline colours (slug-based HSL — see ticket 004)
- **Buttons with icons** — must align reliably without custom CSS
- **Custom colour injection** — SkillPill derives `hsl(...)` from a slug hash as an inline `backgroundColor`. The design system must not fight inline styles.

### Should-have

- Tree-shakeable bundle (SPA; longer initial load acceptable but not wasteful)
- `@material-design-icons/font` compatibility (currently used; SVG alternatives acceptable for bundle size)
- Accessibility at best-effort level (WCAG AA for interactive elements)

### Won't-have (out of scope)

- Server-side rendering / SSR support
- Strict WCAG AAA compliance
- Salesforce SLDS integration

## Design System Candidates Evaluated

A full research and grilling session was conducted. Libraries assessed:

| Library               | Verdict       | Key reason                                                             |
| --------------------- | ------------- | ---------------------------------------------------------------------- |
| **shadcn-vue**        | ✅ **Chosen** | See rationale below                                                    |
| PrimeVue 4 (unstyled) | Runner-up     | Best DataTable; revisit if shadcn-vue Table proves limiting            |
| Naive UI              | Considered    | CSS-in-JS elegant but hard to escape its own aesthetic                 |
| DaisyUI 5             | Partial use   | CSS-only; excellent for named theme token presets alongside shadcn-vue |
| Vuetify 3             | Rejected      | Material Design lock-in; incompatible with wild themes in ticket 003   |
| Headless UI           | Rejected      | Too thin a component catalog for CRUD use                              |
| Reka UI               | Indirect      | shadcn-vue is built on Reka UI primitives                              |
| SLDS                  | Rejected      | No maintained Vue 3 wrapper; Salesforce-brand-only; ~500 KB CSS        |

## Decision: shadcn-vue

**shadcn-vue** (<https://shadcn-vue.com>) — built on **Reka UI** (accessibility primitives, formerly Radix Vue) + **Tailwind CSS**.

### Rationale

1. **Scoped styles are the root problem.** Tailwind utility classes are global by definition — no specificity wars, no hidden cross-component dependencies, consistent tokens everywhere.
2. **Wild theming is a hard requirement** (ticket 003 plans Gothic, TempleOS, 70s retro, Corporate themes). shadcn-vue components live in `src/components/ui/` in _your codebase_ — themes are CSS variable swaps on `<html>`. No fighting a library's defaults.
3. **Replaces current CSS abstractions cleanly.** `.app-input-field` becomes `<UiInput>`. `.app-action-badge` becomes `<UiButton size="icon">`. Components are owned, not installed as a black box.
4. **Vue ecosystem learning.** Reka UI exposes composables and the headless/slots pattern. Tailwind Variants is used for component variants.
5. **SkillPill inline styles are unaffected.** Dynamic computed `hsl(...)` as an inline style coexists with Tailwind's class-based system without conflict.

### Theming approach

- CSS custom properties (`--primary`, `--background`, `--foreground`, `--radius`, etc.) defined in `:root` or `[data-theme="..."]` in global CSS
- Theme swap = swap CSS variable values on `<html>` — no JS re-render required
- **DaisyUI 5** may be introduced alongside shadcn-vue purely for its 35+ pre-built named themes as token starting points for ticket 003. The two are compatible (both use CSS vars on `<html>`).

### Icon system

- Continue using `@material-design-icons/font` (import CSS globally; use `<span class="material-icons">` in templates)
- For production bundle optimisation, consider migrating to `vue-material-design-icons` (SVG, tree-shakeable) as a follow-up

## Implementation Plan

### Phase 1 — Install Tailwind CSS v4 + shadcn-vue

```bash
npm install tailwindcss @tailwindcss/vite
npx shadcn-vue@latest init
```

- Add `@tailwindcss/vite` plugin to `vite.config.ts`
- Add `@import "tailwindcss"` to `src/style.css`
- Remove existing global utility classes after component migration

### Phase 2 — Migrate existing components

Priority order (most painful first):

1. `SkillSelector.vue` — uses `.app-input-field` + `.app-action-badge` most heavily
2. `NameInput.vue` — uses `.app-input-field`
3. `CourseForm.vue`, `TeacherForm.vue`, `SkillForm.vue` — form inputs + buttons
4. `SchedulerForm.vue` — top-level form layout
5. `SkillPill.vue` — migrate wrapper styles to Tailwind; keep inline HSL (see ticket 004)
6. `ClassroomSpinner.vue`, `ScheduleResult.vue` — lowest priority

### Phase 3 — Add missing components (not yet built)

- Sidebar navigation (shadcn-vue `Sheet` or `NavigationMenu`)
- Tooltip (shadcn-vue `Tooltip` built on Reka UI)
- DataTable (shadcn-vue `Table` + TanStack Table for sorting/filtering if needed)

## Related Issues

- **003** — Theme system (dark/light/Gothic/TempleOS/70s/Corporate). shadcn-vue CSS vars + optional DaisyUI named themes directly support it. This ticket (001) must be completed or substantially in progress first.
- **004** — Extracts `useSlugColour` composable from SkillPill. Should be done in parallel with or before Phase 2 SkillPill migration.

## Acceptance Criteria

- [ ] Tailwind CSS v4 installed and working in Vite
- [ ] shadcn-vue CLI initialised; base components generated in `src/components/ui/`
- [ ] `.app-input-field` and `.app-action-badge` removed from `src/style.css`; all usages migrated to shadcn-vue components
- [ ] Button icons align correctly without custom CSS
- [ ] No misaligned button icons
- [ ] `SkillPill` inline `backgroundColor` still works after migration
- [ ] Dark mode (`prefers-color-scheme: dark`) still functional after migration
- [ ] No hardcoded colour literals (`white`, `black`, `#ffffff`, `#000000`) remain in scoped component styles
- [ ] Reduced CSS maintenance burden (fewer lines in `style.css`, fewer scoped style blocks)
- [ ] Maintain capability to import custom colours so that slug-based colour mapping in SkillPill can exist (covered by ticket 004)

---
id: 010
title: Implement frontend inputs for timeslots and course requirements
status: open # open | in-progress | closed
priority: medium # low | medium | high
assignee:
labels: [frontend, vue, ux]
created: 2026-09-14
---

# 010 - Implement frontend inputs for timeslots and course requirements

## Background

Ticket 007 introduces timeslot-based schedule generation in the Prolog engine. This ticket implements the input and state layer in the frontend: UI components for configuring teacher availability and course class requirements, URL state encoding/decoding, and Prolog fact generation in `processForm.ts`.

> Note: Running the `solve_schedule/1` query and rendering the visual timetable grid is split into Ticket 012.

## Requirements & Scope

### 1. Form Types & State Model

- **Teacher Availability:** Update `TeacherProperties` in `src/types/form.d.ts` to include `availableSlots: Set<string>` (e.g. `'mon-1'`, `'tue-3'`).
- **Course Configuration:** Update `CourseProperties` to include:
  - `classCount: number` (total 1-hour sessions per week).
  - `constraints: CourseConstraint[]` (e.g. successive pairs, minimum day spacing).
- **URL Serialization (`formCodec.ts`):** Ensure the expanded `Form` structure serializes compactly into the URL hash (e.g. bitmasks or compact slot strings for teacher availability grids, class counts, and course constraints) without breaking backward compatibility for existing URLs.

### 2. UI / UX Components

- **Teacher Availability Grid (`TeacherForm.vue` / `TeacherCard.vue`):**
  - An interactive weekly matrix (5 days $\times$ 8 periods).
  - Click or click-drag to toggle availability slots.
  - Quick-action presets (e.g. "Select All", "Clear All", "Mornings Only").
- **Course Session & Spacing Controls (`CourseForm.vue` / `CourseCard.vue`):**
  - Numeric stepper / input for classes per week.
  - High-level constraint abstractions so users don't have to manage raw class index numbers manually (e.g. toggles for _"Schedule as double-block"_ or _"Spread over different days"_ that map to underlying `successive(A, B)` and `min_day_gap(A, B, Gap)` primitives).

### 3. Fact Generation (`processForm.ts`)

- Map `form.teachers` available slots to `teacher_available(Teacher, slot(Day, Period)).` facts.
- Map `form.courses` class counts and constraints to `course_classes/2` and `course_constraint/2` facts.
- Ensure generated facts conform strictly to the CLP(FD) schema defined in Ticket 007.

## Acceptance Criteria

- [ ] `TeacherProperties` and `CourseProperties` updated in `src/types/form.d.ts`.
- [ ] `encodeForm` and `decodeForm` preserve teacher availability and course constraints in the URL without breaking existing URLs.
- [ ] Teacher form / card provides an interactive 5x8 grid to toggle available timeslots with preset helpers.
- [ ] Course form / card allows entering class count and selecting spacing/block constraints.
- [ ] `mapFormToFacts` in `src/functions/processForm.ts` generates valid CLP(FD) facts matching the Ticket 007 specification (`teacher_available/2`, `course_classes/2`, and `course_constraint/2`).
- [ ] Unit tests verify form codec encoding/decoding and fact mapping for availability slots and course requirements.

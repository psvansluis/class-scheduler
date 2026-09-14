---
id: 010
title: Implement frontend for timeslots
status: open # open | in-progress | closed
priority: medium # low | medium | high
assignee:
labels: [frontend, vue, ux]
created: 2026-09-14
---

# 010 - Implement frontend for timeslots

## Background

Ticket 007 introduces timeslot-based schedule generation in the Prolog engine. This ticket implements the frontend support: UI components for configuring teacher availability and course class requirements, URL state encoding, fact generation in `processForm.ts`, and a visual timetable grid for displaying the generated schedule.

## Requirements & Scope

### 1. Form Types & State Model

- **Teacher Availability:** Update `TeacherProperties` in `src/types/form.d.ts` to include `availableSlots: Set<string>` (e.g. `'mon-1'`, `'tue-3'`).
- **Course Configuration:** Update `CourseProperties` to include:
  - `classCount: number` (total 1-hour sessions per week).
  - `constraints: CourseConstraint[]` (e.g. successive pairs, minimum day spacing).
- **URL Serialization (`formCodec.ts`):** Ensure the expanded `Form` structure serializes compactly into the URL hash (e.g. bitmasks or compact slot strings for teacher availability grids).

### 2. UI / UX Components

- **Teacher Availability Grid (`TeacherForm.vue` / Teacher Card):**
  - An interactive weekly matrix (5 days $\times$ 8 periods).
  - Click or click-drag to toggle availability slots.
  - Quick-action presets (e.g. "Select All", "Clear All", "Mornings Only").
- **Course Session & Spacing Controls (`CourseForm.vue`):**
  - Numeric stepper / input for classes per week.
  - High-level constraint abstractions so users don't have to manage raw class index numbers manually (e.g. toggles for _"Schedule as double-block"_ or _"Spread over different days"_ that map to underlying `successive(A, B)` and `min_day_gap(A, B, Gap)` primitives).

### 3. Fact Generation & Query (`processForm.ts`)

- Map `form.teachers` available slots to `teacher_available(Teacher, slot(Day, Period)).` facts.
- Map `form.courses` class counts and constraints to `course_classes/2` and `course_constraint/2` facts.
- Update the query runner from `can_teach/2` to `solve_schedule(Schedule)` and parse `class(Course, Index, Teacher, slot(Day, Period))` terms into reactive schedule objects.

### 4. Results Display (`ScheduleResult.vue`)

- Replace the simple text list with a visual **Timetable Grid** (columns: Monday–Friday; rows: Periods 1–8).
- Render scheduled class cards displaying:
  - Course name
  - Assigned teacher (with appropriate slug color)
  - Applicable skill tags
- Display clear error/conflict feedback when the schedule is unsatisfiable.

## Acceptance Criteria

- [ ] `TeacherProperties` and `CourseProperties` updated in `src/types/form.d.ts`.
- [ ] `encodeForm` and `decodeForm` preserve teacher availability and course constraints in the URL without breaking existing URLs.
- [ ] Teacher form provides an interactive 5x8 grid to toggle available timeslots.
- [ ] Course form allows entering class count and selecting spacing/block constraints.
- [ ] `processForm.ts` generates valid CLP(FD) facts matching the Ticket 007 specification and executes `solve_schedule/1`.
- [ ] Results are rendered in a weekly grid view showing courses and assigned teachers.
- [ ] Unsatisfiable schedules display a clear user-facing warning explaining that no valid timetable exists.

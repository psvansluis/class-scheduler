---
id: 012
title: Implement timetable grid and schedule display
status: open # open | in-progress | closed
priority: medium # low | medium | high
assignee:
labels: [frontend, vue, ux, solver]
created: 2026-10-17
---

# 012 - Implement timetable grid and schedule display

## Dependencies

Blocked by:

- Ticket 007: Implement timeslots and schedule generation with CLP(FD)
- Ticket 010: Implement frontend inputs for timeslots and course requirements

## Background

With Ticket 007 defining the CLP(FD) solver rules and Ticket 010 providing the timeslot input state, URL serialization, and fact generation, this ticket connects the frontend query runner to `solve_schedule/1` and presents the resulting timetable grid to the user in `ScheduleResult.vue`.

## Requirements & Scope

### 1. Query Execution & Schedule Parsing (`processForm.ts`)

- Update the query execution in `processForm.ts` from `can_teach/2` to `solve_schedule(Schedule)`.
- Parse `class(Course, Index, Teacher, slot(Day, Period))` terms into reactive schedule objects:

  ```typescript
  interface ScheduledClass {
    course: string;
    classIndex: number;
    teacher: string;
    day: number; // 1..5 (Monday - Friday)
    period: number; // 1..8
  }
  ```

- Catch and handle unsatisfiable states when Prolog returns false / no solutions.

### 2. Timetable Grid Component (`ScheduleResult.vue`)

- Replace the simple text list of facts with an interactive visual **Timetable Grid**:
  - Columns: Monday through Friday (Days 1–5).
  - Rows: Periods 1 through 8.
- Render scheduled class cards inside their respective cells:
  - Course name / label.
  - Assigned teacher label with matching slug styling (`useSlugColour` / `useSlugStyle`).
  - Applicable skill badges / tags.
- Responsive design supporting clean viewing on desktop and tablet screens.

### 3. Error & Unsatisfiable State Handling

- Display clear error/conflict feedback when the schedule is unsatisfiable (e.g. impossible constraint combination or teacher availability shortage).
- Provide a direct link/action to navigate back to edit parameters (`← Edit current form parameters`) while preserving the active state.

## Acceptance Criteria

- [ ] `processForm.ts` executes `solve_schedule/1` against SWI-Prolog and parses `class/4` terms into structured timetable objects.
- [ ] `ScheduleResult.vue` displays a 5-day $\times$ 8-period timetable grid.
- [ ] Scheduled class items display the course, assigned teacher with distinct slug styling, and skill badges.
- [ ] Unsatisfiable schedules show a clear, user-friendly alert explaining that no conflict-free timetable exists.
- [ ] Navigation back to the form retains all user inputs.

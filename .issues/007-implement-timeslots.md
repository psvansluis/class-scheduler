---
id: 007
title: Implement timeslots and schedule generation with CLP(FD)
status: open # open | in-progress | closed
priority: high # low | medium | high
assignee:
labels: [domain, solver, clpfd]
created: 2026-09-14
---

# 007 - Implement timeslots and schedule generation with CLP(FD)

## Background

The scheduler currently evaluates bipartite matching between teachers and courses (`can_teach/2`). This ticket upgrades the Prolog engine to solve a timetabling Constraint Satisfaction Problem (CSP) by placing class instances into discrete timeslots.

To achieve declarative constraints, expressive arithmetic, and clean search pruning, we leverage SWI-Prolog's `library(clpfd)`.

## Domain Concepts

1. **Timeslot Grid:**
   - Represented as compound terms `slot(Day, Period)` where `Day in 1..5` (Mon–Fri) and `Period in 1..8`.
   - Linear global index: `SlotIndex #= (Day - 1) * 8 + Period` for global collision tracking.
2. **Course vs. Class:**
   - A **Course** specifies curriculum requirements: required skills, total class count (`course_classes/2`), and optional temporal constraints (`course_constraint/2`).
   - A **Class** is an atomic scheduled unit: `class(Course, ClassIndex, Teacher, slot(Day, Period))`.
   - A course is taught by a single teacher who satisfies `can_teach(Teacher, Course)`. All classes for that course inherit that same teacher.
3. **Teacher Availability (Allow-List):**
   - `teacher_available(Teacher, slot(Day, Period))`. Teachers may only be assigned to slots they have explicitly marked available.
4. **Collision Avoidance:**
   - A teacher can only teach one class at a time (`all_distinct` on teacher's scheduled slot indices).
   - The architecture leaves the door open for Room and Cohort collision avoidance using the identical `all_distinct` pattern.

## Fact Schema (Composable Primitives)

```prolog
% Course definition
course_classes(algebra, 3). % Requires 3 classes: indices 1, 2, 3

% Temporal constraints between class indices
course_constraint(algebra, successive(1, 2)).      % Classes 1 & 2 are back-to-back on same day
course_constraint(algebra, min_day_gap(2, 3, 1)).  % At least 1 day between class 2 and class 3

% Teacher availability allow-list
teacher_available(mr_jansen, slot(1, 1)).
teacher_available(mr_jansen, slot(1, 2)).
```

## Proposed Predicate API

```prolog
% solve_schedule(-Schedule)
% Schedule is a list of class(Course, Index, Teacher, slot(Day, Period))
solve_schedule(Schedule) :- ...
```

## Acceptance Criteria

- [ ] **CLP(FD) Integration:** `prolog/rules.pl` imports and utilizes `library(clpfd)`.
- [ ] **Teacher Assignment:** Each course is assigned exactly one teacher possessing the required skills (`can_teach/2`), and that teacher teaches all classes of that course.
- [ ] **Availability Adherence:** Classes are only scheduled into timeslots explicitly declared in `teacher_available/2`.
- [ ] **No Double-Booking:** A teacher is never assigned to multiple classes in the same timeslot.
- [ ] **Successive Slot Constraint:** `course_constraint(Course, successive(A, B))` guarantees `DayB #= DayA` and `PeriodB #= PeriodA + 1`.
- [ ] **Day Gap Constraint:** `course_constraint(Course, min_day_gap(A, B, Gap))` guarantees `DayB - DayA #>= Gap + 1`.
- [ ] **Unsatisfiable Detection:** When constraints conflict or insufficient availability exists, `solve_schedule/1` fails cleanly without throwing errors.
- [ ] **PlUnit Test Suite:** Comprehensive PlUnit tests in `prolog/tests.pl` verifying each hard constraint individually and in combination.

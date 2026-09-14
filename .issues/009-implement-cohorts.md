---
id: 009
title: Implement cohorts
status: open # open | in-progress | closed
priority: medium # low | medium | high
assignee:
labels: [domain, solver, clpfd]
created: 2026-09-14
---

# 009 - Implement cohorts

## Background

Following the timeslot architecture established in ticket 007, student groups must be modeled so that students receive their required curriculum without scheduling conflicts.

## Key Insights & Requirements

1. **Definition:**
   - A **Cohort** is a fixed group of students that follows one precise curriculum (e.g. "Class 10A").
2. **Curriculum Binding:**
   - A course is offered to one or more cohorts.
   - All classes of a given course instance must have the same cohort and the same teacher.
3. **Collision Avoidance:**
   - A cohort can only follow one class at any given timeslot.
   - Modeled via CLP(FD): all slot indices assigned to a given `Cohort` must be `all_distinct`.
4. **Homework & Fatigue Spacing:**
   - Cohorts benefit heavily from the spacing constraints developed in ticket 007 (e.g. avoiding two heavy academic classes back-to-back, or ensuring homework gaps between sessions).
5. **Size**
   - A cohort consists of an integer number of students. A given Course can be taught to multiple cohorts at a time, but only to the extent that the Room has Capacity for it.
6. **Scheduled Unit Integration:**
   - Integrates with the atomic class representation:
     `class(Course, ClassIndex, Teacher, Room, Cohort, slot(Day, Period))`

## Acceptance Criteria

- [ ] Cohorts defined as entities with a target curriculum (list of required courses).
- [ ] Solver assigns cohort bindings to scheduled course classes.
- [ ] A cohort is never scheduled for more than one class in the same timeslot.
- [ ] PlUnit tests verifying cohort schedule feasibility and collision avoidance.

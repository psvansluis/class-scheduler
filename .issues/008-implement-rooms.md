---
id: 008
title: Implement rooms
status: open # open | in-progress | closed
priority: medium # low | medium | high
assignee:
labels: [domain, solver, clpfd]
created: 2026-09-14
---

# 008 - Implement rooms

## Background

Following the timeslot and teacher scheduling architecture established in ticket 007, physical classrooms must be modeled as a shared, constrained resource.

## Key Insights & Requirements

1. **Collision Avoidance:**
   - A room can only hold one class at any given timeslot.
   - Modeled via CLP(FD) constraint: all slot indices assigned to a given `Room` must be `all_distinct`.
2. **Room Assignment Flexibility:**
   - Not all classes of a given course need to be held in the exact same room (e.g. lecture classes in Room A, practical lab classes in Lab B).
3. **Room Capabilities / Specialization:**
   - Courses may require specific room features (e.g. Science Lab, Computer Room, Gymnasium).
   - Rooms can be associated with supported facilities/skills, matching course room requirements similarly to how teachers match skills.
4. **Scheduled Unit Integration:**
   - Extends the atomic class representation:
     `class(Course, ClassIndex, Teacher, Room, Cohort, slot(Day, Period))`

## Acceptance Criteria

- [ ] Rooms defined as entities with optional special equipment/capabilities.
- [ ] Courses can optionally specify room type requirements.
- [ ] Solver assigns a suitable room to each scheduled class instance.
- [ ] Two classes are never scheduled in the same room at the same timeslot.
- [ ] PlUnit tests verifying room assignment and collision avoidance.

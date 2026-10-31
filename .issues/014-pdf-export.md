---
id: 014
title: PDF export
status: open # open | in-progress | closed
priority: medium # low | medium | high
assignee:
labels: []
created: 2026-10-31
---

# 014 - PDF export

## Description

- I want to experiment with wrapping a (La)TeX or a Typst implementation in WebAssembly. A choice needs to be made before starting on this ticket.
- Anyone using this scheduler would want to print these schedules to hand out to teachers, classes, et cetera.

## Dependencies

- Soft dependency on 008 - rooms. If I want to export room schedules, I need to implement rooms first.
- The same as the above goes for 009 - cohorts.

## Acceptance Criteria

- [ ] The schedules for every teacher, room, and cohort are printed on PDF
- [ ] Every teacher/room/cohort gets its own page on the PDF
- [ ] A page must never overflow. Truncate long names if necessary.
- [ ] A block on the teacher page contains its course, room and cohort.
- [ ] A block on the room page contains its teacher, course and cohort.
- [ ] A block on the cohort page contains its teacher, course and room.

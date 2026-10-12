---
id: 006
title: Make a teacher card in the form input
status: closed # open | in-progress | closed
priority: medium # low | medium | high
assignee:
labels: []
created: 2026-09-14
---

# 006 - Make a teacher card in the form input

## Description

Right now in the input, previously submitted teachers are some sort of big pill.

Let's make this a proper card. The header is the teacher name, and the body is information such as skills, timeslots.

Furthermore, the creation of these cards is currently a mess. You need to enter a name, select skills, and then press enter. Pressing enter too early means adding no skills, and they cannot be added after the fact. Let's streamline this: for creation, only a name is input, and every other property of a teacher happens in his card.

## Acceptance Criteria

- [x] Submitted teachers in the teacher input component are their own component
- [x] The teacher component uses shadcn's card component
- [x] slug-based background colouring is in effect
- [x] skills are addable and removable in the card
- [ ] timeslots are configurable (only if picked up after implementing FE for timeslots: ticket 010)
- [ ]
